// components/OffersPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const offers = [
  {
    id: 1,
    title: 'Weekend Special',
    discount: '20% OFF',
    description: 'On all birthday cakes every weekend',
    code: 'WEEKEND20',
    validTill: 'Ongoing',
    image: '/premium_cake_hero_1777274022400.png',
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 2,
    title: 'First Order',
    discount: '15% OFF',
    description: 'For new customers on first purchase',
    code: 'NEW15',
    validTill: 'Limited Time',
    image: '/berry_chantilly_cake_1777274053963.png',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    title: 'Bulk Order',
    discount: '25% OFF',
    description: 'On orders above ₹2000',
    code: 'BULK25',
    validTill: 'Limited Time',
    image: '/chocolate_truffle_cake_1777274037721.png',
    color: 'from-orange-500 to-red-500'
  }
];

const OffersPage = () => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-pink-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-pink-100 px-4 py-2 rounded-full mb-4">
            <span className="text-orange-500 text-lg">🎉</span>
            <span className="text-pink-600 font-black uppercase tracking-wider text-xs">Limited Time Offers</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-['Outfit'] font-black text-gray-900 uppercase tracking-tighter">
            Sweet Deals Just For You
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Grab these amazing offers before they're gone!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-2">Hurry Up! Offer Ends In</p>
            <div className="flex gap-6 justify-center">
              <div className="text-center">
                <div className="bg-gray-900 text-white rounded-xl px-4 py-2 min-w-[60px]">
                  <span className="text-2xl font-bold">12</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Days</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-900 text-white rounded-xl px-4 py-2 min-w-[60px]">
                  <span className="text-2xl font-bold">08</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Hours</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-900 text-white rounded-xl px-4 py-2 min-w-[60px]">
                  <span className="text-2xl font-bold">45</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Mins</p>
              </div>
              <div className="text-center">
                <div className="bg-gray-900 text-white rounded-xl px-4 py-2 min-w-[60px]">
                  <span className="text-2xl font-bold">22</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Secs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div key={offer.id} className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${offer.color} opacity-10 rounded-full blur-2xl translate-x-16 -translate-y-16`}></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-4xl font-['Outfit'] font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-500">
                      {offer.discount}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${offer.color} text-white text-xs font-bold`}>
                    {offer.validTill}
                  </div>
                </div>
                
                <h3 className="text-xl font-['Outfit'] font-black text-gray-900 mb-2">{offer.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{offer.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <div className="bg-gray-100 rounded-xl px-4 py-2 flex items-center space-x-2">
                    <span className="font-mono font-bold text-gray-700">{offer.code}</span>
                    <button 
                      onClick={() => copyCode(offer.code)}
                      className="text-pink-600 hover:text-pink-700 transition"
                    >
                      Copy
                    </button>
                  </div>
                  {copiedCode === offer.code && (
                    <span className="text-green-500 text-xs animate-bounce">Copied!</span>
                  )}
                </div>
                
                <Link to="/menu" className="block w-full text-center bg-gradient-to-r from-pink-600 to-rose-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all">
                  Shop Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Banner */}
        <div className="mt-12 bg-gradient-to-r from-pink-600 to-rose-500 rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-['Outfit'] font-black mb-2">🎂 Refer & Earn!</h3>
          <p className="mb-4 opacity-90">Share with friends - Get ₹100 off on next order when they make their first purchase</p>
          <button className="bg-white text-pink-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-all">
            Share Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default OffersPage;