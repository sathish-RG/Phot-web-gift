import { AnimatePresence, motion, Reorder } from "framer-motion";
import PhotoCard from "./PhotoCard";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export default function GalleryGrid({ photos, isLiked, onToggleLike, onLikeEvent, onImageLoad, onDeleteEvent, onReorderEvent, onSaveOrderEvent, isDraggable }) {
  if (photos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="text-6xl mb-4">🫙</div>
        <h3 className="font-display font-bold text-2xl text-purple-300 mb-2">
          No wishes yet
        </h3>
        <p className="font-body text-purple-400/60 text-sm">
          Try selecting a different filter
        </p>
      </motion.div>
    );
  }

  if (!isDraggable) {
    return (
      <motion.div
        id="gallery-grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-4 sm:px-6 w-full max-w-sm md:max-w-none mx-auto box-border"
      >
        <AnimatePresence mode="popLayout">
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              index={index}
              isLiked={isLiked(photo.id)}
              onToggleLike={onToggleLike}
              onLikeEvent={onLikeEvent}
              onImageLoad={onImageLoad}
              onDeleteEvent={onDeleteEvent}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <Reorder.Group
      id="gallery-grid"
      axis="y"
      values={photos}
      onReorder={onReorderEvent}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-4 sm:px-6 w-full max-w-sm md:max-w-none mx-auto box-border"
    >
      <AnimatePresence mode="popLayout">
        {photos.map((photo, index) => (
          <Reorder.Item 
            key={photo.id} 
            value={photo} 
            onDragEnd={onSaveOrderEvent}
            className="w-full box-border relative flex flex-col"
          >
            <PhotoCard
              photo={photo}
              index={index}
              isLiked={isLiked(photo.id)}
              onToggleLike={onToggleLike}
              onLikeEvent={onLikeEvent}
              onImageLoad={onImageLoad}
              onDeleteEvent={onDeleteEvent}
            />
          </Reorder.Item>
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
