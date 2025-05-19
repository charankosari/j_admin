import { useState, useEffect } from 'react';
import { APISDK, IBanner } from '@/libs/api';
import { PlusCircle, Trash2, X } from 'lucide-react';
import { usePopup } from '@/context/popup-context';

interface Banner extends IBanner {
  image_url: string;
}

export function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBannerImage, setNewBannerImage] = useState<File | null>(null);
  const { showPopup } = usePopup();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const api = APISDK.getInstance();
      const response = await api.getBanners();
      const mappedBanners: Banner[] = response.map(banner => ({
        ...banner,
        image_url: banner.image
      }));
      setBanners(mappedBanners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      showPopup('Failed to fetch banners', { type: 'error' });
    }
  };

  const handleAddBanner = async () => {
    if (!newBannerImage) {
      showPopup('Please provide an image', { type: 'warning' });
      return;
    }
    try {
      const api = APISDK.getInstance();
      
      const formData = new FormData();
      formData.append('file', newBannerImage);

      await api.createBanner(formData);

      setIsAddModalOpen(false);
      setNewBannerImage(null);
      fetchBanners();
      showPopup('Banner added successfully', { type: 'success' });
    } catch (error) {
      console.error('Error adding banner:', error);
      showPopup('Failed to add banner', { type: 'error' });
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    try {
      const api = APISDK.getInstance();
      await api.deleteBanner(bannerId);
      fetchBanners();
      showPopup('Banner deleted successfully', { type: 'success' });
    } catch (error) {
      console.error('Error deleting banner:', error);
      showPopup('Failed to delete banner', { type: 'error' });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl text-black mb-4">Banner Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="border rounded-lg p-4">
            <img src={banner.image_url} alt="Banner" className="w-full h-40 object-cover rounded-lg mb-2" />
            <div className="flex justify-end mt-2">
              <button onClick={() => handleDeleteBanner(banner.id)} className="text-red-500">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        <div className="border rounded-lg p-4 flex items-center justify-center cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle size={24} className="text-gray-400" />
          <span className="ml-2 text-gray-400">Add New Banner</span>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg text-black ">Add New Banner</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewBannerImage(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleAddBanner}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add Banner
            </button>
          </div>
        </div>
      )}
    </div>
  );
}