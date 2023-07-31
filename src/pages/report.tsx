import { data } from "~/cve";
import { SeverityGage } from "~/components/SeverityGauge";
import { CvssBox } from "~/components/CvssBox";
import { CpeBox } from "~/components/CpeBox";
import { LongDescription } from "~/components/LongDescription";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { ThreatBar } from "~/components/ThreatBar";
import { ThreatReport } from "~/components/ThreatReport";
import { Remediation } from "~/components/Remediation";
import { References } from "~/components/References";
import { useEffect, useState } from "react";
import { ChatBar } from "~/components/ChatBar";

export interface Cve {
  CVEDataFormat: string;
  CVEDataType: string;
  CVEDataVersion: string;
  CVEDataNumberOfCVEs: string;
  CVEDataTimestamp: string;
  CVEItems: null;
  CVEDataMeta: CVEDataMeta;
  Description: Description;
  Analysis: Analysis;
  CPE: Cpe;
  CVSSV3: Cvssv3;
  References: string[];
  Tags: null;
}

export interface Analysis {
  short_title: string;
  long_description: string;
  short_description: string;
  threat_analysis: string;
  remediation_plan: string;
  tags: string[];
}

export interface Cpe {
  operator: string;
  children: Child[];
}

export interface Child {
  operator: string;
  cpe_match: CpeMatch[];
}

export interface CpeMatch {
  vulnerable: boolean;
  cpe23Uri: string;
}

export interface CVEDataMeta {
  ID: string;
  ASSIGNER: string;
}

export interface Cvssv3 {
  version: string;
  vectorString: string;
  attackVector: string;
  attackComplexity: string;
  privilegesRequired: string;
  userInteraction: string;
  scope: string;
  confidentialityImpact: string;
  integrityImpact: string;
  availabilityImpact: string;
  baseScore: number;
  baseSeverity: string;
}

export interface Description {
  description_data: DescriptionDatum[];
}

export interface DescriptionDatum {
  lang: string;
  value: string;
}

export default function Report() {
  const [isMobile, setIsMobile] = useState(false);
  const loading = false;
  if (typeof window !== "undefined") {
    localStorage.setItem("description", data[0].Analysis.short_description);
  }
  

  useEffect(() => {
    // Check if window is defined (it won't be in server-side rendering)
    if (typeof window !== "undefined") {
      // Initial value, is it mobile or not?
      setIsMobile(window.innerWidth < 768);

      // Add resize listener
      const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };

      window.addEventListener("resize", handleResize);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  return (
    <div
      className="circuit-board container flex flex-col p-4 sm:p-2"
      style={{ maxWidth: "1000px", margin: "0 auto" }}
    >
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <h1>
            Loading: <LoadingSpinner />
          </h1>
        </div>
      ) : (
        <div className="flex h-full gap-2 rounded-xl bg-white/10 p-2 text-white">
          <div className="flex-grow overflow-auto">
            {data.map((cve, index) => (
              <div key={index} className="mb-2 mt-2 w-full rounded-md p-2">
                <h3 className="pb-2 font-orbitron text-xl font-bold sm:text-lg">
                  {cve.CVEDataMeta.ID} - {cve.Analysis.short_title}
                </h3>
                <div className="mb-2 rounded-md border border-violet-200/60 bg-white/10 p-2 shadow-lg md:flex md:flex-row">
                  <div className="h-48 w-72 md:flex md:flex-row">
                    <SeverityGage />
                  </div>
                  <div className="px-2 font-roboto md:mt-6 md:flex md:flex-row md:gap-4">
                    <CvssBox score={cve.CVSSV3.baseScore} />
                    {isMobile ? (
                      <CpeBox cve={cve} mobile={true} />
                    ) : (
                      <CpeBox cve={cve} mobile={false} />
                    )}
                  </div>
                </div>

                <div className="mb-2 flex flex-col justify-between gap-4 text-xl sm:flex-col">
                  <div className="flex flex-col">
                    <div className="pb-1 font-orbitron text-xs font-bold uppercase tracking-wider text-violet-100 text-opacity-70">
                      Short Description
                    </div>
                    <div className="font-roboto">
                      <div className="space-y-2 font-roboto">
                        <ReactMarkdown>
                          {cve.Analysis.short_description}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
                <LongDescription cve={cve} />
                <ThreatBar cve={cve} />
                <ThreatReport cve={cve} />
                <Remediation cve={cve} />
                <References cve={cve} />
                <hr className="mt-4 sm:mt-2"></hr>
              </div>
            ))}
          </div>
        </div>
      )}
      <ChatBar onSend={(message: string) => console.log(message)} />
    </div>
  );
}

export const LoadingSpinner = () => {
  return (
    <svg
      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  );
};
