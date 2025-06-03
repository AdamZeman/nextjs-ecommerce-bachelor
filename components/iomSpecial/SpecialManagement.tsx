import React, { useState, useEffect } from 'react';
import AddSpecial from "@/components/iomSpecial/AddSpecial";
import EditSpecial from "@/components/iomSpecial/EditSpecial";
import {GetSpecialRow} from "@/db/goqueries/query_sql";
import Modal from "@/components/Modal";


function SpecialManagement() {
    const [specials, setSpecials] = useState<GetSpecialRow[]>([]);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [selectedSpecial, seSelectedSpecial] = useState<GetSpecialRow | null>(null);

    const fetchInitial = async () => {
        try {
            const res = await fetch('/api/iom/special/ShowSpecials');
            const data = await res.json();
            setSpecials(data.specials);
        } catch (error) {
            console.error('Error fetching specials:', error);
        }
    };

    const handleAddClick = () => {
        setShowAddForm(true);
        seSelectedSpecial(null);
    };

    const handleRowClick = (special:GetSpecialRow) => {
        seSelectedSpecial(special);
        setShowAddForm(true);
    };

    useEffect(() => {
        fetchInitial();
    }, []);

    return (
        <div className="relative flex flex-col flex-1 p-4 gap-4">
            {showAddForm && (
                <div className="absolute right-0 top-0 z-10" id="addition">
                    <Modal isOpen={showAddForm} onClose={() => setShowAddForm(false)}>
                        {selectedSpecial ? (
                            <EditSpecial
                                onClose={() => setShowAddForm(false)}
                                setSpecials={setSpecials}
                                special={selectedSpecial}
                            />
                        ) : (
                            <AddSpecial
                                onClose={() => setShowAddForm(false)}
                                setSpecials={setSpecials}
                            />
                        )}
                    </Modal>

                </div>
            )}

            <div className="flex gap-4 justify-end items-center">
                <button
                    onClick={handleAddClick}
                    className="flex font-medium text-sm px-5 py-2.5 text-white bg-masala-950 transition-all duration-300 overflow-hidden rounded-lg"
                >
                    Add
                </button>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                    <thead className="text-xs text-gray-100 uppercase bg-masala-950">
                    <tr>
                        <th scope="col" className="px-6 py-3">ID</th>
                        <th scope="col" className="px-6 py-3">Category Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {specials.map((special) => (
                        <tr
                            key={special.id}
                            className="bg-white border-b hover:bg-masala-950 hover:border-gray-700 hover:text-white border-gray-200 transition duration-200 cursor-pointer"
                            onClick={() => handleRowClick(special)}
                        >
                            <input
                                type="hidden"
                                id={`id-${special.id}`}
                                name="id"
                                value={special.id}
                            />
                            <th scope="row" className="px-6 py-4 font-medium">
                                {special.id}
                            </th>
                            <td className="px-6 py-4">{special.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SpecialManagement;