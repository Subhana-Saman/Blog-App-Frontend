import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function BlogSkeleton() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">

      <Skeleton
        height={240}
        baseColor="#d4d4d8"
        highlightColor="#e4e4e7"
      />

      <div className="p-5">

        <div className="flex items-center gap-3 mb-4">

          <Skeleton
            circle
            width={40}
            height={40}
          />

          <div className="flex-1">

            <Skeleton height={12} width={120} />

            <Skeleton
              height={10}
              width={80}
              className="mt-2"
            />

          </div>

        </div>

        <Skeleton
          height={28}
          borderRadius={10}
        />

        <Skeleton
          height={20}
          className="mt-4"
          borderRadius={10}
        />

        <Skeleton
          height={20}
          className="mt-2"
          borderRadius={10}
        />

        <Skeleton
          height={20}
          width="70%"
          className="mt-2"
          borderRadius={10}
        />

        <div className="flex justify-between items-center mt-6">

          <Skeleton
            width={90}
            height={36}
            borderRadius={12}
          />

          <div className="flex gap-3">

            <Skeleton
              circle
              width={36}
              height={36}
            />

            <Skeleton
              circle
              width={36}
              height={36}
            />

          </div>

        </div>

      </div>
    </div>
  );
}