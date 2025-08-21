'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Commitment } from '@/lib/types';
import { getStatusColor, getGovernmentStatusColor, formatDate } from '@/lib/utils';

interface CommitmentModalProps {
    commitment: Commitment | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function CommitmentModal({ commitment, isOpen, onClose }: CommitmentModalProps) {
    if (!commitment) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-[#272727] font-soehne">
                        {commitment.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Summary */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#272727] mb-2">Summary</h3>
                        <p className="text-gray-700">{commitment.summary}</p>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#272727] mb-2">Description</h3>
                        <p className="text-gray-700">{commitment.description}</p>
                    </div>

                    {/* Status and Deadline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-[#272727] mb-2">Status</h3>
                            <Badge className={`${getStatusColor(commitment.status)} border font-medium text-base px-3 py-1`}>
                                {commitment.status}
                            </Badge>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-[#272727] mb-2">Deadline</h3>
                            <p className="text-gray-700">{formatDate(commitment.deadline)}</p>
                        </div>
                    </div>

                    {/* Jurisdiction Status Table */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#272727] mb-4">Jurisdiction Status</h3>
                        <div className="border border-[#d3c7b9] rounded-lg overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-[#d3c7b9]">
                                    <tr>
                                        <th className="text-left p-3 font-semibold text-gray-700 font-founders uppercase tracking-wide text-sm">
                                            Jurisdiction
                                        </th>
                                        <th className="text-left p-3 font-semibold text-gray-700 font-founders uppercase tracking-wide text-sm">
                                            Status
                                        </th>
                                        <th className="text-left p-3 font-semibold text-gray-700 font-founders uppercase tracking-wide text-sm">
                                            Notes
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commitment.jurisdictionStatuses?.map((jurisdiction, index) => (
                                        <tr
                                            key={jurisdiction.name}
                                            className={`border-b border-[#d3c7b9] ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                }`}
                                        >
                                            <td className="p-3 font-medium text-gray-900">
                                                {jurisdiction.name}
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    className={`${getGovernmentStatusColor(jurisdiction.status)} border text-xs`}
                                                >
                                                    {jurisdiction.status}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-gray-600 text-sm">
                                                {jurisdiction.notes}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-4 border-t border-[#d3c7b9]">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div>
                                    <span className="font-medium">Created:</span> {formatDate(commitment.createdAt)}
                                </div>
                                <div>
                                    <span className="font-medium">Updated:</span> {formatDate(commitment.updatedAt)}
                                </div>
                            </div>
                            {commitment.sourceUrl && (
                                <a
                                    href={commitment.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#8b2332] hover:text-[#6b1a1a] underline font-medium font-founders uppercase tracking-wide"
                                >
                                    View Source
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
