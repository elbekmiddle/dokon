import Image from "next/image";
import Light from "../public/light.svg"
import Link from "next/link";
import onbutton from '../public/on-button.svg'
import Key from '../public/key.svg' 
import Home from '../public/home.svg'

export default function PaginationMenu() {
    return (
      <div className=" layout-content-container flex flex-col w-80">
        <div className="flex h-full min-h-[700px] flex-col justify-between bg-white p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[#f0f2f4]">
                <div
                  className="text-[#111418]"
                  data-icon="Lightning"
                  data-size="24px"
                  data-weight="fill"
                >
                 <Image src={Light} alt="" />
                </div>
                <p className="text-[#111418] text-sm font-medium leading-normal">
                  <Link href={'/category/avtomatika'} >
                  Avtomatika
                  </Link>
                </p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="text-[#111418]"
                  data-icon="Power"
                  data-size="24px"
                  data-weight="regular"
                >
                 <Image src={onbutton} alt="" />
                </div>
                <p className="text-[#111418] text-sm font-medium leading-normal">
                <Link href={'/category/elektr'} >
                  Elektr
                  </Link>
                </p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="text-[#111418]"
                  data-icon="Wrench"
                  data-size="24px"
                  data-weight="regular"
                >
                 <Image src={Key} alt="" />
                </div>
                <p className="text-[#111418] text-sm font-medium leading-normal">
                <Link href={'/category/Inzheneriya'} >  
                Inzheneriya
                  </Link>
                </p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="text-[#111418]"
                  data-icon="House"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z"></path>
                  </svg>
                </div>
                <p className="text-[#111418] text-sm font-medium leading-normal">
                <Link href={'/category/Qurilish'} >  
                    Qurilish
                  </Link>
                </p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="text-[#111418]"
                  data-icon="Drop"
                  data-size="24px"
                  data-weight="regular"
                >
                <Image src={Home} alt="" />
                </div>
                <p className="text-[#111418] text-sm font-medium leading-normal">
                <Link href={'/category/Santexnika'} >  
                    Santexnika
                  </Link>
                </p>
              </div>
              <div className="flex items-center gap-3 px-3 py-2">
                <div
                  className="text-[#111418]"
                  data-icon="WifiHigh"
                  data-size="24px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M140,204a12,12,0,1,1-12-12A12,12,0,0,1,140,204ZM237.08,87A172,172,0,0,0,18.92,87,8,8,0,0,0,29.08,99.37a156,156,0,0,1,197.84,0A8,8,0,0,0,237.08,87ZM205,122.77a124,124,0,0,0-153.94,0A8,8,0,0,0,61,135.31a108,108,0,0,1,134.06,0,8,8,0,0,0,11.24-1.3A8,8,0,0,0,205,122.77Zm-32.26,35.76a76.05,76.05,0,0,0-89.42,0,8,8,0,0,0,9.42,12.94,60,60,0,0,1,70.58,0,8,8,0,1,0,9.42-12.94Z"></path>
                  </svg>
                </div>
                <p className="text-[#111418] text-sm font-medium leading-normal">
                <Link href={'/category/Tarmoq'} >  
                    Tarmoq
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div />
      </div>
    );
  }
  