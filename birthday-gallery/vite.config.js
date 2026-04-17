import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs'
import path from 'path'

function localUploadsPlugin() {
  return {
    name: 'local-uploads-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/upload' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const { imageBase64, ...photoData } = data;
              let imageUrl = photoData.image || ''; // Fallback
              
              if (imageBase64) {
                // Determine extension and decode base64
                const matches = imageBase64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                  const ext = matches[1].replace('jpeg', 'jpg');
                  const buffer = Buffer.from(matches[2], 'base64');
                  const fileName = `img_${Date.now()}.${ext}`;
                  const uploadPath = path.resolve(__dirname, 'public/uploads');
                  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
                  fs.writeFileSync(path.join(uploadPath, fileName), buffer);
                  imageUrl = `/uploads/${fileName}`;
                }
              }

              const photosFile = path.resolve(__dirname, 'src/data/photos.js');
              let content = fs.readFileSync(photosFile, 'utf-8');
              
              const parsedNewObj = { 
                id: Date.now(), 
                name: photoData.name, 
                type: photoData.type || "wish", 
                wish: photoData.wish || "", 
                tag: photoData.tag, 
                mystery: false, 
                image: imageUrl, 
                color: "#e879f9" 
              };

              const newObjStr = `\n  { id: ${parsedNewObj.id}, name: ${JSON.stringify(parsedNewObj.name)}, type: ${JSON.stringify(parsedNewObj.type)}, wish: ${JSON.stringify(parsedNewObj.wish)}, tag: ${JSON.stringify(parsedNewObj.tag)}, mystery: false, image: ${JSON.stringify(parsedNewObj.image)}, color: "#e879f9" },`;
              
              content = content.replace('export const photos = [', `export const photos = [${newObjStr}`);
              fs.writeFileSync(photosFile, content);

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, photo: parsedNewObj }));
            } catch (err) {
              console.error('Upload Error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localUploadsPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Birthday Gallery',
        short_name: 'BdayGallery',
        theme_color: '#f4c0d1',
        background_color: '#fbeaf0',
        display: 'standalone',
        icons: [
           {
            src: 'https://cdn-icons-png.flaticon.com/512/376/376092.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      }
    })
  ],
})
