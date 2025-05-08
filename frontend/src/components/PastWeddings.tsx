import React from "react";
import { useNavigate } from "react-router-dom";

const PastWeddings = () => {
  const navigate = useNavigate();

  const handleViewGallery = () => {
    navigate("/gallerywedding");
  };

  return (
    <div className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-scolor/5 rounded-full blur-xl"></div>
      <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-scolor/5 rounded-full blur-xl"></div>

      {/* Enhanced masonry-style grid with better spacing and visual appeal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 - Taller first image */}
        <div className="space-y-8 transform md:translate-y-6">
          {/* Gangadara Wedding */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/485809368_9407282996051716_8575320238435271759_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=lQsmVLN1V7IQ7kNvwHRjsHb&_nc_oc=AdnlL65Q74GN_j7PbtQ5al-UbfzTIy7HpjdFe8w6O6sDVGcgDkQXiSmFElhXAV4kiA4&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=Y_hDTaieyX3uSEWh6FkzCg&oh=00_AfIlJ7YeVzJUtYN9Xuc9KNoeVXNSEhALtOcXVSYrYmFtwg&oe=68220D1A"
              alt="Mr & Miss Gangadara"
              className="w-full h-full object-contain transition-all duration-700 transform group-hover:scale-110 filter group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span className="inline-block bg-scolor/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-2">
                April 2023
              </span>
              <h3 className="text-white text-xl font-semibold group-hover:text-scolor transition-all duration-300">
                Mr & Miss Gangadara
              </h3>
              <p className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Grand Ballroom • 175 Guests
              </p>
            </div>
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
              <a
                href="/gallery"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/50 text-white px-3 py-1 rounded-full text-xs transition-all duration-300"
              >
                View Gallery
              </a>
            </div>
          </div>

          {/* Kulawansha Wedding */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/482192611_1149310170317227_4688005920583767976_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=127cfc&_nc_ohc=s43JDQp1zMAQ7kNvwF3x0ps&_nc_oc=AdkSYoQmdOyqpTcX8kPQFxwrnMBYXqAUpp2C1uKz8t3MvNHsbO8TW7QzGI_BxkaZg_E&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=OgltfM9Ec46PpOovdGgraw&oh=00_AfKCw6IYxKp4kAy60duT5NN4ERh7SrYY8BPLvQ0gaoEvvQ&oe=68221D8A"
              alt="Mr & Miss Kulawansha"
              className="w-full h-72 object-cover transition-all duration-700 transform group-hover:scale-110 filter group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span className="inline-block bg-scolor/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-2">
                February 2023
              </span>
              <h3 className="text-white text-xl font-semibold group-hover:text-scolor transition-all duration-300">
                Mr & Miss Kulawansha
              </h3>
              <p className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Garden Pavilion • 120 Guests
              </p>
            </div>
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
              <a
                href="/gallery"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/50 text-white px-3 py-1 rounded-full text-xs transition-all duration-300"
              >
                View Gallery
              </a>
            </div>
          </div>
        </div>

        {/* Column 2 - Featured wedding (larger) */}
        <div className="space-y-8">
          {/* Hettige Wedding - Featured (taller) */}
          <div className="relative group overflow-hidden rounded-xl shadow-xl border border-gray-100">
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-scolor text-white text-xs uppercase tracking-wider font-medium py-1 px-3 rounded-full shadow-lg">
                Featured
              </span>
            </div>
            <img
              src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t1.6435-9/84247592_2708842889229127_6112942337246101504_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=9mn6ilrrxdwQ7kNvwEmrgQ0&_nc_oc=AdmQddtIbg1446rH-NEz9VVI3qCNHAoCjhKC34h9nq17c_I6dl77Dy56Lg7-ozaqEUQ&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=xuEDILiHnp1u1XvkIgTZLQ&oh=00_AfKIjmECn_uyyYG_K9whY9_mATV52c-Z2aYWscIR4NZt-g&oe=6843B3A0"
              alt="Mr & Miss Hettige"
              className="w-full h-[480px] object-cover transition-all duration-1000 transform group-hover:scale-110 filter group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span className="inline-block bg-scolor/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-2">
                August 2022
              </span>
              <h3 className="text-white text-2xl font-semibold group-hover:text-scolor transition-all duration-300">
                Mr & Miss Hettige
              </h3>
              <p className="text-white/80 text-sm mt-2 max-w-md opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Grand Ballroom • 250 Guests • Traditional & Modern Fusion
              </p>
              <a
                href="/gallery"
                className="mt-4 bg-white/20 backdrop-blur-sm hover:bg-scolor text-white px-4 py-2 rounded-md text-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 inline-block"
              >
                View Wedding Story
              </a>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-8 transform md:translate-y-12">
          {/* Perera Wedding */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t39.30808-6/482089195_9314975351949148_8918596987697890183_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=127cfc&_nc_ohc=zl9feu-pqacQ7kNvwE_Dudk&_nc_oc=Admq69YhFsXJdS7eMt2ElbJfSL7_ou0Eu3GRgbS6Uo_u-bhayJIgTjnbkyRWcNOYOp8&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=eomdALA9Ow-GGY_fNKCQ3A&oh=00_AfI9shqXLXgt6w_UDJ2MZEEz80YB-rQ7WYyGrao035lDSw&oe=6822150D"
              alt="Mr & Miss Perera"
              className="w-full h-96 object-cover transition-all duration-700 transform group-hover:scale-110 filter group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span className="inline-block bg-scolor/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-2">
                March 2023
              </span>
              <h3 className="text-white text-xl font-semibold group-hover:text-scolor transition-all duration-300">
                Mr & Miss Perera
              </h3>
              <p className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Lakeside Pavilion • 200 Guests
              </p>
            </div>
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
              <a
                href="/gallery"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/50 text-white px-3 py-1 rounded-full text-xs transition-all duration-300"
              >
                View Gallery
              </a>
            </div>
          </div>

          {/* Abeynayaka Wedding */}
          <div className="relative group overflow-hidden rounded-xl shadow-lg">
            <img
              src="https://scontent.fcmb1-2.fna.fbcdn.net/v/t1.6435-9/128915191_1425233804352073_5132045480129997937_n.jpg?stp=dst-jpg_p526x395_tt6&_nc_cat=107&ccb=1-7&_nc_sid=f727a1&_nc_ohc=E233f771s2YQ7kNvwEIAYyJ&_nc_oc=AdnUMTtEmwKfnxz7Ui7J8VpFG78265kFvz2RW9n_fJBRf_NSwf8iwmZAosW1DDSFc7E&_nc_zt=23&_nc_ht=scontent.fcmb1-2.fna&_nc_gid=dZI6YNhEGQYI3yPbXqqJSA&oh=00_AfIv61ZPDNgWqqcZYIigz9qQhWRfPIV6O8nkkR3PoZDnyg&oe=68439503"
              alt="Mr & Miss Abeynayaka"
              className="w-full h-72 object-cover transition-all duration-700 transform group-hover:scale-110 filter group-hover:brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
              <span className="inline-block bg-scolor/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mb-2">
                December 2022
              </span>
              <h3 className="text-white text-xl font-semibold group-hover:text-scolor transition-all duration-300">
                Mr & Miss Abeynayaka
              </h3>
              <p className="text-white/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Executive Hall • 150 Guests
              </p>
            </div>
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-500">
              <a
                href="/gallery"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/50 text-white px-3 py-1 rounded-full text-xs transition-all duration-300"
              >
                View Gallery
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* View more button */}
      <div className="mt-12 text-center">
        <a
          href="/gallery"
          className="bg-transparent border-2 border-scolor hover:bg-scolor text-scolor hover:text-white px-6 py-2 rounded-md transition-all duration-300 group flex items-center mx-auto inline-flex"
        >
          <span className="mr-2">View More Weddings</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="transition-transform duration-300 transform group-hover:translate-x-1"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default PastWeddings;
