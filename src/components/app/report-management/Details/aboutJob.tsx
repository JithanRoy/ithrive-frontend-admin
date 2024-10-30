import React from 'react';

import type { TReportManagementDetails } from '@library/schemas/report-management';
type Props = {
    apiData: TReportManagementDetails;
};
const AboutJobDetails = ({ apiData }: Props) => {
    return (
        <div>
            {apiData.reportedEvent.aboutJob ??
                (apiData.userReport.reportFor === 'job' && (
                    <div>
                        <div className="my-5 font-bold text-xl">About the job</div>
                        <p>{apiData?.reportedEvent.aboutJob}</p>
                        <div className="my-5 font-bold text-xl">Your role includes</div>
                        <div>
                            <ul className="flex flex-col gap-3">
                                {apiData?.reportedEvent.roleIncludes ? (
                                    apiData?.reportedEvent.roleIncludes.split('\n').map((item, index) => <li key={index}>{item}</li>)
                                ) : (
                                    <li>No data available</li>
                                )}
                            </ul>
                        </div>
                        <div className="my-5 font-bold text-xl">Key Qualifications</div>
                        <div>
                            <ul className="flex flex-col gap-3">
                                {apiData?.reportedEvent.keyQualification ? (
                                    apiData?.reportedEvent.keyQualification.split('\n').map((item, index) => <li key={index}>{item}</li>)
                                ) : (
                                    <li>No data available</li>
                                )}
                            </ul>
                        </div>
                        <div className="my-5 font-bold text-xl">Compensation & Other Benefits</div>
                        <div>
                            <ul className="flex flex-col gap-3">
                                {apiData?.reportedEvent.compensationOtherBenefit ? (
                                    apiData?.reportedEvent.compensationOtherBenefit.split('\n').map((item, index) => <li key={index}>{item}</li>)
                                ) : (
                                    <li>No data available</li>
                                )}
                            </ul>
                        </div>
                        <div className="my-5 font-bold text-xl">Application Instruction</div>
                        <p>{apiData?.reportedEvent.applicationInstruction}</p>
                    </div>
                ))}
        </div>
    );
};

export default AboutJobDetails;
