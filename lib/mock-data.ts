import type { Agreement } from "./types";

export const mockAgreements: Agreement[] = [
  {
    id: "1",
    title: "Harmonize Long-Combination Vehicle Standards",
    summary:
      "Standardize driver qualifications and vehicle specifications for long-combination vehicles across all provinces.",
    description:
      "This comprehensive initiative aims to create uniform standards for long-combination vehicles (LCVs) across participating provinces. The agreement covers driver qualification requirements, vehicle specifications including length and weight limits, safety equipment standards, and operational guidelines. By harmonizing these standards, the initiative will reduce regulatory barriers that currently prevent efficient interprovincial transportation of goods, ultimately lowering costs for businesses and consumers while maintaining safety standards.",
    jurisdictions: [
      {
        name: "Alberta",
        status: "Complete",
        notes:
          "Fully implemented new LCV standards and driver certification program",
      },
      {
        name: "British Columbia",
        status: "Complete",
        notes:
          "Complete implementation with updated regulations effective January 2024",
      },
      {
        name: "Saskatchewan",
        status: "Implementing",
        notes:
          "Standards implemented, minor administrative processes still being finalized",
      },
      {
        name: "Manitoba",
        status: "Committed",
        notes:
          "Partial implementation - standards adopted but driver certification program pending",
      },
      {
        name: "Ontario",
        status: "Aware",
        notes: "No action taken - reviewing potential participation",
      },
      {
        name: "Quebec",
        status: "Declined",
        notes:
          "Not participating due to different regulatory framework preferences",
      },
      {
        name: "New Brunswick",
        status: "Considering",
        notes: "Monitoring progress but no commitment to participate",
      },
      {
        name: "Nova Scotia",
        status: "Aware",
        notes: "No current plans to adopt LCV standards",
      },
      {
        name: "Prince Edward Island",
        status: "Not Applicable",
        notes: "Infrastructure limitations prevent LCV operations",
      },
      {
        name: "Newfoundland and Labrador",
        status: "Not Applicable",
        notes: "Geographic constraints limit applicability",
      },
      {
        name: "Northwest Territories",
        status: "Considering",
        notes: "Evaluating potential benefits for northern transportation",
      },
      {
        name: "Nunavut",
        status: "Not Applicable",
        notes: "Current infrastructure not suitable for LCV operations",
      },
      {
        name: "Yukon",
        status: "Considering",
        notes: "Assessing feasibility for highway corridors",
      },
    ],
    deadline: "2025-06-30",
    status: "Agreement Reached",
    sourceUrl: "https://example.gov.ca/trade-agreements/lcv-standards",
    createdAt: "2024-01-15",
    updatedAt: "2024-12-01",
  },
  {
    id: "2",
    title: "Unified Construction Code Implementation",
    summary:
      "Implement harmonized construction codes across Canada to eliminate regulatory barriers.",
    description:
      "This initiative establishes a unified national construction code framework that eliminates the need for construction companies to navigate different building standards across provinces. The harmonized code covers structural requirements, fire safety standards, accessibility provisions, and energy efficiency requirements. Implementation includes mutual recognition of building permits, standardized inspection processes, and unified certification for construction professionals.",
    jurisdictions: [
      {
        name: "Alberta",
        status: "Declined",
        notes: "Maintaining provincial building code - no plans to harmonize",
      },
      {
        name: "British Columbia",
        status: "Considering",
        notes: "Initial discussions held but no formal commitment",
      },
      {
        name: "Saskatchewan",
        status: "Aware",
        notes: "Not participating in current harmonization efforts",
      },
      {
        name: "Manitoba",
        status: "Considering",
        notes: "Reviewing potential benefits but no action taken",
      },
      {
        name: "Ontario",
        status: "Complete",
        notes: "Fully implemented unified code with updated regulations",
      },
      {
        name: "Quebec",
        status: "Complete",
        notes: "Complete implementation with French-language documentation",
      },
      {
        name: "New Brunswick",
        status: "Complete",
        notes: "Successfully adopted harmonized code framework",
      },
      {
        name: "Nova Scotia",
        status: "Implementing",
        notes: "Implementation complete, minor administrative updates ongoing",
      },
      {
        name: "Prince Edward Island",
        status: "Considering",
        notes: "Considering participation - conducting feasibility study",
      },
      {
        name: "Newfoundland and Labrador",
        status: "Aware",
        notes: "No current plans to adopt unified code",
      },
      {
        name: "Northwest Territories",
        status: "Not Applicable",
        notes: "Unique northern construction requirements limit applicability",
      },
      {
        name: "Nunavut",
        status: "Not Applicable",
        notes: "Specialized Arctic building standards required",
      },
      {
        name: "Yukon",
        status: "Not Applicable",
        notes: "Climate-specific requirements not addressed in unified code",
      },
    ],
    deadline: "2025-12-31",
    status: "Implemented",
    sourceUrl: "https://example.gov.ca/construction-codes/harmonization",
    createdAt: "2024-02-20",
    updatedAt: "2024-11-15",
  },
  {
    id: "3",
    title: "Trucking Hours of Service Alignment",
    summary:
      "Align sunrise and sunset definitions for trucking hour restrictions across provincial boundaries.",
    description:
      "This agreement standardizes the interpretation of sunrise and sunset times for commercial trucking operations, eliminating confusion and compliance issues for drivers crossing provincial boundaries. The initiative includes unified rest period requirements, standardized logbook procedures, and coordinated enforcement protocols to ensure consistent application of hours of service regulations.",
    jurisdictions: [
      {
        name: "Alberta",
        status: "Implementing",
        notes: "New regulations drafted, awaiting final approval",
      },
      {
        name: "British Columbia",
        status: "Committed",
        notes:
          "Partial alignment achieved, some definitions still under review",
      },
      {
        name: "Saskatchewan",
        status: "Implementing",
        notes: "Implementation nearly complete, training programs underway",
      },
      {
        name: "Manitoba",
        status: "Complete",
        notes: "Fully aligned with standardized definitions",
      },
      {
        name: "Ontario",
        status: "Committed",
        notes: "Partial implementation - some regional variations remain",
      },
      {
        name: "Quebec",
        status: "Declined",
        notes: "Not participating due to different regulatory approach",
      },
      {
        name: "New Brunswick",
        status: "Implementing",
        notes: "Standards implemented, enforcement training in progress",
      },
      {
        name: "Nova Scotia",
        status: "Complete",
        notes: "Complete alignment with unified hours of service rules",
      },
      {
        name: "Prince Edward Island",
        status: "Implementing",
        notes: "Implementation complete, minor administrative updates pending",
      },
      {
        name: "Newfoundland and Labrador",
        status: "Committed",
        notes:
          "Partial adoption - ferry schedule considerations being addressed",
      },
      {
        name: "Northwest Territories",
        status: "Not Applicable",
        notes: "Extreme daylight variations complicate standard definitions",
      },
      {
        name: "Nunavut",
        status: "Not Applicable",
        notes: "Arctic conditions require specialized hour definitions",
      },
      {
        name: "Yukon",
        status: "Not Applicable",
        notes: "Seasonal daylight extremes not addressed in standard framework",
      },
    ],
    deadline: "2025-03-31",
    status: "Under Negotiation",
    sourceUrl: "https://example.gov.ca/trucking/hours-service",
    createdAt: "2024-03-10",
    updatedAt: "2024-12-10",
  },
  {
    id: "4",
    title: "Heavy-Duty Tow Truck Weight Standards",
    summary:
      "Establish uniform maximum weight standards for heavy-duty tow trucks.",
    description:
      "This initiative creates standardized weight limits and operational guidelines for heavy-duty tow trucks operating across provincial boundaries. The agreement covers maximum gross vehicle weights, axle load distributions, equipment specifications, and operator certification requirements to ensure safe and efficient cross-border towing operations.",
    jurisdictions: [
      {
        name: "Alberta",
        status: "Declined",
        notes: "Not participating - maintaining current provincial standards",
      },
      {
        name: "British Columbia",
        status: "Aware",
        notes: "No plans to adopt uniform standards",
      },
      {
        name: "Saskatchewan",
        status: "Aware",
        notes: "Satisfied with existing weight regulations",
      },
      {
        name: "Manitoba",
        status: "Committed",
        notes: "Standards adopted but implementation timeline extended",
      },
      {
        name: "Ontario",
        status: "Complete",
        notes: "Fully implemented uniform weight standards",
      },
      {
        name: "Quebec",
        status: "Implementing",
        notes: "Implementation complete, minor enforcement adjustments ongoing",
      },
      {
        name: "New Brunswick",
        status: "Aware",
        notes: "Not participating in current standardization effort",
      },
      {
        name: "Nova Scotia",
        status: "Aware",
        notes: "No current plans to adopt uniform standards",
      },
      {
        name: "Prince Edward Island",
        status: "Not Applicable",
        notes: "Limited heavy-duty towing operations - not applicable",
      },
      {
        name: "Newfoundland and Labrador",
        status: "Not Applicable",
        notes: "Island geography limits cross-border towing needs",
      },
      {
        name: "Northwest Territories",
        status: "Not Applicable",
        notes: "Specialized northern equipment requirements",
      },
      {
        name: "Nunavut",
        status: "Not Applicable",
        notes: "Limited road infrastructure - not applicable",
      },
      {
        name: "Yukon",
        status: "Not Applicable",
        notes: "Unique terrain requirements not addressed",
      },
    ],
    deadline: "2025-09-15",
    status: "Agreement Reached",
    sourceUrl: "https://example.gov.ca/transport/tow-truck-standards",
    createdAt: "2024-04-05",
    updatedAt: "2024-11-20",
  },
  {
    id: "9",
    title: "Cross-Border Digital Services Tax Harmonization",
    summary:
      "High-priority initiative to eliminate double taxation on digital services across provinces.",
    description:
      "This critical initiative addresses the growing need to prevent double taxation of digital services as businesses increasingly operate across provincial boundaries. The framework would establish uniform tax treatment for cloud services, digital advertising, software licensing, and online marketplace transactions.",
    jurisdictions: [
      {
        name: "Alberta",
        status: "Unknown",
        notes: "No formal discussions initiated",
      },
      {
        name: "British Columbia",
        status: "Unknown",
        notes: "Awaiting federal leadership on digital tax framework",
      },
      {
        name: "Saskatchewan",
        status: "Unknown",
        notes: "No action - monitoring other provinces' positions",
      },
      {
        name: "Manitoba",
        status: "Unknown",
        notes: "No current engagement on this issue",
      },
      {
        name: "Ontario",
        status: "Unknown",
        notes: "Internal review of digital taxation challenges ongoing",
      },
      {
        name: "Quebec",
        status: "Unknown",
        notes: "No formal position established",
      },
      {
        name: "New Brunswick",
        status: "Unknown",
        notes: "No resources allocated to this initiative",
      },
      {
        name: "Nova Scotia",
        status: "Unknown",
        notes: "Not actively pursuing digital tax harmonization",
      },
      {
        name: "Prince Edward Island",
        status: "Unknown",
        notes: "No current involvement in discussions",
      },
      {
        name: "Newfoundland and Labrador",
        status: "Unknown",
        notes: "No formal engagement on digital taxation",
      },
      {
        name: "Northwest Territories",
        status: "Unknown",
        notes: "No position on digital services taxation",
      },
      {
        name: "Nunavut",
        status: "Unknown",
        notes: "Not participating in digital tax discussions",
      },
      {
        name: "Yukon",
        status: "Unknown",
        notes: "No current involvement in this initiative",
      },
    ],
    deadline: null,
    status: "Awaiting Sponsorship",
    sourceUrl: null,
    createdAt: "2024-09-01",
    updatedAt: "2024-12-15",
  },
  {
    id: "10",
    title: "Emergency Response Resource Sharing Protocol",
    summary:
      "Critical need for standardized emergency response resource sharing during natural disasters.",
    description:
      "This essential initiative would establish protocols for sharing emergency response resources including personnel, equipment, and expertise during natural disasters and other emergencies. The framework would include mutual aid agreements, resource inventory systems, cost-sharing mechanisms, and coordinated command structures.",
    jurisdictions: [
      {
        name: "Alberta",
        status: "Unknown",
        notes: "No formal framework discussions initiated",
      },
      {
        name: "British Columbia",
        status: "Unknown",
        notes: "Relying on existing ad-hoc arrangements",
      },
      {
        name: "Saskatchewan",
        status: "Unknown",
        notes: "No structured approach to resource sharing",
      },
      {
        name: "Manitoba",
        status: "Unknown",
        notes: "No formal emergency resource sharing protocols",
      },
      {
        name: "Ontario",
        status: "Unknown",
        notes: "Internal emergency management review ongoing",
      },
      {
        name: "Quebec",
        status: "Unknown",
        notes: "No commitment to standardized sharing protocols",
      },
      {
        name: "New Brunswick",
        status: "Unknown",
        notes: "No formal engagement on resource sharing framework",
      },
      {
        name: "Nova Scotia",
        status: "Unknown",
        notes: "Not participating in standardization discussions",
      },
      {
        name: "Prince Edward Island",
        status: "Unknown",
        notes: "No current involvement in resource sharing protocols",
      },
      {
        name: "Newfoundland and Labrador",
        status: "Unknown",
        notes: "No formal emergency resource sharing agreements",
      },
      {
        name: "Northwest Territories",
        status: "Unknown",
        notes: "No structured resource sharing framework",
      },
      {
        name: "Nunavut",
        status: "Unknown",
        notes: "Not engaged in formal resource sharing discussions",
      },
      {
        name: "Yukon",
        status: "Unknown",
        notes: "No current participation in sharing protocols",
      },
    ],
    deadline: null,
    status: "Awaiting Sponsorship",
    sourceUrl: null,
    createdAt: "2024-10-15",
    updatedAt: "2024-12-12",
  },
];
