import { useState, useEffect } from "react";
import {
  XMarkIcon,
  PhotoIcon,
  HeartIcon,
  TrophyIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { cn } from "../utils/cn";

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: () => void;
  editingStory?: any;
}

export default function CreateStoryModal({
  isOpen,
  onClose,
  onStoryCreated,
  editingStory,
}: CreateStoryModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "success",
    images: [] as File[],
    existingImages: [] as string[], // To hold existing image URLs when editing
  });

  const categories = [
    {
      id: "success",
      name: "Success Story",
      icon: <HeartIcon className="w-5 h-5" />,
      color: "bg-green-100 text-green-800",
    },
    {
      id: "impact",
      name: "Impact Story",
      icon: <TrophyIcon className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: "community",
      name: "Community Story",
      icon: <UsersIcon className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-800",
    },
  ];

  // Pre-fill form data when editingStory changes
  useEffect(() => {
    if (editingStory) {
      setFormData({
        title: editingStory.title || "",
        content: editingStory.content || "",
        category: editingStory.category || "success",
        images: [],
        existingImages: editingStory.images || [],
      });
      setError(null);
      setSuccess(null);
    } else {
      setFormData({
        title: "",
        content: "",
        category: "success",
        images: [],
        existingImages: [],
      });
      setError(null);
      setSuccess(null);
    }
  }, [editingStory, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3); // Max 3 images
      setFormData((prev) => ({ ...prev, images: files }));
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!user) {
      setError("Please sign in to share your story.");
      setLoading(false);
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in both title and content.");
      setLoading(false);
      return;
    }

    if (formData.content.length < 50) {
      setError("Story content should be at least 50 characters long.");
      setLoading(false);
      return;
    }

    try {
      const imageUrls: string[] = [...formData.existingImages];

      // Upload new images if any
      if (formData.images.length > 0) {
        for (const image of formData.images) {
          const imageRef = ref(
            storage,
            `storyImages/${user.uid}_${Date.now()}_${image.name}`
          );
          await uploadBytes(imageRef, image);
          const url = await getDownloadURL(imageRef);
          imageUrls.push(url);
        }
      }

      if (editingStory?.id) {
        // Update existing story document
        await updateDoc(doc(db, "communityStories", editingStory.id), {
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          images: imageUrls,
          updatedAt: Timestamp.now(),
        });
        setSuccess("Your story has been successfully updated!");
      } else {
        // Create new story document
        await addDoc(collection(db, "communityStories"), {
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          images: imageUrls,
          author: {
            id: user.uid,
            name: user.displayName || user.email || "Anonymous",
            email: user.email,
          },
          likes: 0,
          likedBy: [],
          createdAt: Timestamp.now(),
        });
        setSuccess("Your story has been shared with the community!");
      }

      onStoryCreated();

      setTimeout(() => {
        onClose();
        setFormData({
          title: "",
          content: "",
          category: "success",
          images: [],
          existingImages: [],
        });
        setError(null);
        setSuccess(null);
      }, 1500);
    } catch (err) {
      setError("Failed to share your story. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingStory ? "Edit Your Story" : "Share Your Story"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Story Title */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Story Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g., How MealBridge Changed My Life"
              className="input-field"
              required
            />
          </div>

          {/* Story Category */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Story Category *
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={cn(
                    "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all",
                    formData.category === category.id
                      ? "border-primary-500 bg-primary-50 font-bold text-primary-700"
                      : "border-gray-200 bg-white hover:bg-gray-100"
                  )}
                >
                  <input
                    type="radio"
                    value={category.id}
                    checked={formData.category === category.id}
                    onChange={(e) =>
                      handleInputChange("category", e.target.value)
                    }
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      {category.icon}
                    </div>
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Story Content */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Your Story *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              placeholder="Share your experience with MealBridge. How has it impacted your life or community? What challenges did you overcome? What positive changes have you seen?"
              rows={8}
              className="input-field"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Minimum 50 characters ({formData.content.length}/50)
            </p>
          </div>

          {/* Existing Uploaded Images Preview with Remove option */}
          {formData.existingImages.length > 0 && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Existing Photos
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.existingImages.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 rounded overflow-hidden cursor-pointer border border-gray-300"
                  >
                    <img
                      src={url}
                      alt={`Story image ${idx + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(idx)}
                      className="absolute top-0 right-0 bg-white rounded-bl px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Story Images Upload */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Add Photos (Optional)
            </label>
            <div
              className="p-6 text-center transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 cursor-pointer"
              onClick={() => document.getElementById("story-images")?.click()}
              style={{ minHeight: 70 }}
            >
              <PhotoIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <div className="text-sm text-gray-600">
                <label
                  htmlFor="story-images"
                  className="cursor-pointer text-primary-600 hover:text-primary-500"
                >
                  Click to upload photos
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB each (max 3 photos)
              </p>
              <input
                id="story-images"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            {formData.images.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-green-600">
                  {formData.images.length} photo(s) selected:
                </p>
                <ul className="mt-1 text-sm text-gray-600">
                  {formData.images.map((file, i) => (
                    <li key={i} className="truncate">
                      • {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Story Guidelines */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="mb-2 font-medium text-blue-900">Story Guidelines</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Share authentic experiences and genuine impact</li>
              <li>• Be respectful and considerate of others</li>
              <li>• Focus on positive outcomes and community building</li>
              <li>• Include specific details that others can relate to</li>
            </ul>
          </div>

          {/* Error / Success Messages */}
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-200 rounded-lg">
              {success}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                setError(null);
                setSuccess(null);
              }}
              className="flex-1 btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary"
              disabled={loading}
            >
              {loading
                ? editingStory
                  ? "Updating..."
                  : "Sharing..."
                : editingStory
                ? "Update Story"
                : "Share Story"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
