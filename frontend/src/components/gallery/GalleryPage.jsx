import { useState } from "react";

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDetailView, setIsDetailView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Full gallery items collection with additional details
  const galleryItems = [
    {
      id: 1,
      category: "shoes",
      image: "/lovable-uploads/2143f66d-b947-4cb7-8cb3-6a70953b8e43.png",
      title: "Premium Sport Shoes"
    },
    {
      id: 2,
      category: "shoes",
      image: "/lovable-uploads/casual-shoes.png",
      title: "Casual Canvas Sneakers"
    },
    {
      id: 3,
      category: "bags",
      image: "/lovable-uploads/leather-bag.png",
      title: "Premium Leather Tote"
    },
    {
      id: 4,
      category: "electronics",
      image: "/lovable-uploads/wireless-headphones.png",
      title: "Noise-Cancelling Headphones"
    },
    {
      id: 5,
      category: "gaming",
      image: "/lovable-uploads/gaming-controller.png",
      title: "Pro Gaming Controller"
    },
    {
      id: 6,
      category: "electronics",
      image: "/lovable-uploads/smart-watch.png",
      title: "Fitness Smart Watch"
    }
  ];

  const categories = [
    { value: "all", label: "All categories" },
    { value: "shoes", label: "Shoes" },
    { value: "bags", label: "Bags" },
    { value: "electronics", label: "Electronics" },
    { value: "gaming", label: "Gaming" }
  ];

  const filteredItems = galleryItems.filter(
    (item) => selectedCategory === "all" || item.category === selectedCategory
  );

  // Handle item selection
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setIsDetailView(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Go back to gallery view
  const handleBackToGallery = () => {
    setIsDetailView(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative h-[500px] bg-cover bg-center flex items-center justify-center text-white text-center px-6 md:px-12" style={{ backgroundImage: `url('/images/Gallery.jpg')` }}>
        <div className=" p-10 rounded-xl animate-on-scroll opacity-0 transition-opacity duration-300">
         
        </div>
      </section>

      {!isDetailView ? (
        <>
          {/* Categories */}
          <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-start overflow-x-auto">
              <div className="flex space-x-4">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`py-2 px-4 rounded-full transition duration-300 whitespace-nowrap ${
                      selectedCategory === category.value
                        ? "bg-pcolor text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-scolor"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Product Detail View
        selectedItem && (
          <div className="max-w-6xl mx-auto px-6 py-12">
            <button
              onClick={handleBackToGallery}
              className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span className="mr-2">←</span> Back to Gallery
            </button>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="md:flex">
                {/* Product Image */}
                <div className="md:w-1/2">
                  <div className="aspect-square">
                    <img
                      src={selectedItem.image}
                      alt={selectedItem.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default GalleryPage;
