import { Text } from "@tremor/react";

/** Dashboard Footer component */
const Footer = () => {
  return (
    <footer className="footer footer-center w-full p-6">
      <div className="text-center">
        <Text className="font-light text-sm">
          Copyright © {new Date().getFullYear()} -{" "}
          <span className="text-black font-semibold">
            MapleBear<span className="text-red-600">Sunshine</span>
          </span>
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
