import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <div className="flex justify-start gap-3">
        <img src="/logo.png" className="h-12" />
        <div className="font-semibold">
          <div>
            MapleBear<span className="text-red-600">Sunshine</span>
          </div>
          <div className="text-sm font-light">Canadian School</div>
        </div>
      </div>
    </Link>
  );
};

export default Logo;
