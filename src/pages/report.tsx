import Link from "next/link";
import { api } from "~/utils/api";

import { data } from "~/cve";

export interface Cve {
    CVEDataFormat:       string;
    CVEDataType:         string;
    CVEDataVersion:      string;
    CVEDataNumberOfCVEs: string;
    CVEDataTimestamp:    string;
    CVEItems:            null;
    CVEDataMeta:         CVEDataMeta;
    Description:         Description;
    Analysis:            Analysis;
    CPE:                 Cpe;
    CVSSV3:              Cvssv3;
    References:          string[];
    Tags:                null;
}

export interface Analysis {
    short_title:       string;
    long_description:  string;
    short_description: string;
    threat_analysis:   string;
    remediation_plan:  string;
    tags:              string[];
}

export interface Cpe {
    operator: string;
    children: Child[];
}

export interface Child {
    operator:  string;
    cpe_match: CpeMatch[];
}

export interface CpeMatch {
    vulnerable: boolean;
    cpe23Uri:   string;
}

export interface CVEDataMeta {
    ID:       string;
    ASSIGNER: string;
}

export interface Cvssv3 {
    version:               string;
    vectorString:          string;
    attackVector:          string;
    attackComplexity:      string;
    privilegesRequired:    string;
    userInteraction:       string;
    scope:                 string;
    confidentialityImpact: string;
    integrityImpact:       string;
    availabilityImpact:    string;
    baseScore:             number;
    baseSeverity:          string;
}

export interface Description {
    description_data: DescriptionDatum[];
}

export interface DescriptionDatum {
    lang:  string;
    value: string;
}


export default function Report() {
  const loading = false;

  return (
    <div className="container flex flex-col p-8">
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <h1>
            Loading: <LoadingSpinner />
          </h1>
        </div>
      ) : (
        <div className="flex h-full flex-col gap-2 rounded-xl bg-white/10 p-4 text-white">
          <div className="flex-grow overflow-auto">
            {data.map((cve, index) => (
              <div key={index} className="mb-4 rounded-md p-4 shadow-lg">
                <h3 className="text-2xl font-bold">
                  {cve.CVEDataMeta.ID} - {cve.Analysis.short_title}
                  <hr className="my-2 mb-10" />
                </h3>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        Severity Chart
                    </div>
                    <div className="flex flex-col">
                        asdf
                    </div>
                </div>




                <div className="flex flex-row justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm">
                      CVSSv3 Base Score: {cve.CVSSV3.baseScore}
                    </p>
                    <p className="text-sm">
                      CVSSv3 Base Severity: {cve.CVSSV3.baseSeverity}
                    </p>
                    <p className="text-sm">
                      CIA Impact: 
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm">
                      CVSSv3 Vector String: {cve.CVSSV3.vectorString}
                    </p>
                    <p className="text-sm">
                      CVSSv3 Attack Vector: {cve.CVSSV3.attackVector}
                    </p>
                    <p className="text-sm">CPE: {cve.cpe23Uri}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm">
                      CVSSv3 Attack Complexity: {cve.CVSSV3.attackComplexity}
                    </p>
                    <p className="text-sm">
                      CVSSv3 Privileges Required:{" "}
                      {cve.CVSSV3.privilegesRequired}
                    </p>
                    <p className="text-sm">
                      CVSSv3 User Interaction: {cve.CVSSV3.userInteraction}
                    </p>
                  </div>
                  <div className="flex flex-col">
                    <p className="text-sm">
                      Vendor: 
                    </p>
                    <p className="text-sm">
                      Product: 
                    </p>
                    <p className="text-sm">
                      Version:
                    </p>
                  </div>
                </div>

                <h4 className="mb-2 text-xl font-bold">
                  CVE ID: {cve.CVEDataMeta.ID}
                </h4>
                <p>
                  <strong>Description:</strong>{" "}
                  {cve.Description.description_data[0]?.value}
                </p>
                <p>
                  <strong>CVSSv3 Base Score:</strong> {cve.CVSSV3.baseScore}
                </p>
                <p>
                  <strong>CVSSv3 Base Severity:</strong>{" "}
                  {cve.CVSSV3.baseSeverity}
                </p>
                <p>
                  <strong>Analysis:</strong>
                </p>
                <ul>
                  <li>
                    <strong>Short Title:</strong> {cve.Analysis.short_title}
                  </li>
                  <li>
                    <strong>Long Description:</strong>{" "}
                    {cve.Analysis.long_description}
                  </li>
                  <li>
                    <strong>Threat Analysis:</strong>{" "}
                    {cve.Analysis.threat_analysis}
                  </li>
                  <li>
                    <strong>Remediation Plan:</strong>{" "}
                    {cve.Analysis.remediation_plan}
                  </li>
                </ul>
                <p>
                  <strong>References:</strong>
                </p>
                <ul>
                  {cve.References.map((ref, i) => (
                    <li key={i}>
                      <a href={ref}>{ref}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
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
