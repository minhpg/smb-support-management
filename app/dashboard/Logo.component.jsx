import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/dashboard">
      <div className="flex justify-start gap-3">
        <Image src="/logo.png" width={44} height={48} />
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
