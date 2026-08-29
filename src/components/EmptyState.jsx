const EmptyState = ({ title, subtitle }) => {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold">
        {title}
      </h2>

      <p className="text-gray-500 mt-3">
        {subtitle}
      </p>
    </div>
  );
};

export default EmptyState;