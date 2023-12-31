import Link from "next/link";
import type { Cve } from "~/pages/report";

interface CpeBoxProps {
  cve: Cve;
  mobile: boolean;
}

export const CpeBox = ({ cve, mobile }: CpeBoxProps) => {
  // Pull out the vendor, product, and version from the CPE string array
  const cpe = cve.CPE;
  let Vendor = "";
  let Product = "";
  let Version = "";
  let cpeUri = "";

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  function truncateString(string: string, length: number) {
    const truncated = string.slice(0, length);
    return truncated.length < string.length ? truncated + "..." : truncated;
  }

  // Loop through the cpe.children array
  for (const child of cpe.children) {
    // Check if cpe_match array exists in the child object
    if (child.cpe_match) {
      // Loop through the cpe_match array
      for (const match of child.cpe_match) {
        // Check if the match object is vulnerable
        if (match.vulnerable) {
          // Parse the cpe23Uri string to extract vendor, product and version
          cpeUri = match.cpe23Uri;
          const parts = match.cpe23Uri.split(":");
          Vendor = truncateString(capitalizeFirstLetter(parts[3] ?? ""), 16); // ? Should process this to add icons for common vendors (e.g. Microsoft, Apple, etc.) in the future
          Product = truncateString(parts[4] ?? "", 16); // ? Should process this to add icons for common products (e.g. internet explorer, etc.) in the future
          Version = truncateString(parts[5] ?? "", 16);
          break;
        }
      }
    }
    // If vendor, product and version have been found, break the loop
    if (Vendor && Product && Version) {
      break;
    }
  }
  return (
    <div className="pl-2 font-orbitron">
      <div className="mb-3 flex flex-col md:flex-row gap-4">
        <div className="flex flex-col">
          <div className="text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
            Vendor
          </div>
          <div className="flex">{Vendor}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
            Product
          </div>
          <div className="flex">
            <div className="overflow-ellipsis whitespace-nowrap">{Product}</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
            Version
          </div>
          <div className="flex">{Version}</div>
        </div>
      </div>

      {mobile ? (
        <div className="flex flex-col">
          <div className="mb-1">
            <div className="text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
              CPE 2.3 URI
            </div>
            <Link
              href={`https://nvd.nist.gov/products/cpe/detail/0B36C194-E2F9-47C8-8063-74F27D3789B3?namingFormat=2.3&orderBy=CPEURI&keyword=${cpeUri}&status=FINAL&startIndex=0&resultsPerPage=20`}
            >
              <div className="overflow-ellipsis whitespace-nowrap font-mono text-xs hover:text-violet-600 truncate">
                {cpeUri}
              </div>
            </Link>
          </div>
          <hr className="mb-2 border-dotted border-violet-200/60" />
          <div className="mb-1">
            <div className="text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
              CVSS Vector
            </div>
            <div className="overflow-hidden">
              <div className="overflow-ellipsis whitespace-nowrap">
                <Link
                  href={`https://www.first.org/cvss/calculator/3.0#${cve.CVSSV3.vectorString}`}
                >
                  <div className="font-mono text-xs hover:text-violet-600 truncate">
                    {cve.CVSSV3.vectorString}
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <hr className="mb-2 border-dotted border-violet-200/60" />
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="mb-1">
            <div className="text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
              CPE 2.3 URI
            </div>
            <Link
              href={`https://nvd.nist.gov/products/cpe/detail/0B36C194-E2F9-47C8-8063-74F27D3789B3?namingFormat=2.3&orderBy=CPEURI&keyword=${cpeUri}&status=FINAL&startIndex=0&resultsPerPage=20`}
            >
              <div className="overflow-ellipsis whitespace-nowrap font-mono text-xs hover:text-violet-600">
                {cpeUri}
              </div>
            </Link>
          </div>
          <hr className="mb-2 border-dotted border-violet-200/60" />
          <div className="mb-1">
            <div className="text-2xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
              CVSS Vector
            </div>
            <div className="overflow-hidden">
              <div className="overflow-ellipsis whitespace-nowrap">
                <Link
                  href={`https://www.first.org/cvss/calculator/3.0#${cve.CVSSV3.vectorString}`}
                >
                  <div className="font-mono text-xs hover:text-violet-600">
                    {cve.CVSSV3.vectorString}
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <hr className="mb-2 border-dotted border-violet-200/60" />
        </div>
      )}
    </div>
  );
};
