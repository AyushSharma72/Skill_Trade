const 
Header = ({title, description}) => {
  return (
    <div className="bg-white shadow-lg border-b border-gray-200 pt-18 sm:pt-0 md:pt-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center text-center gap-4 lg:gap-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-900 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              {title}
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base lg:text-lg">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default 
Header;
