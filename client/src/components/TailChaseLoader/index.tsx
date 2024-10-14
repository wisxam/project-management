import dynamic from "next/dynamic";

const TailChaseLoader = () => (
  <div className="flex h-full items-center justify-center">
    <l-tail-chase size="40" speed="1.75" color="gray" />
  </div>
);

export default dynamic(() => Promise.resolve(TailChaseLoader), {
  ssr: false,
});
