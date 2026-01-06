import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Eye, FileText } from 'lucide-react';
import { toast } from 'sonner';
import PrescriptionForm from '@/components/PrescriptionForm';

const Prescriptions = () => {
    const { user } = useAuth();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        if (user) {
            fetchPrescriptions();
        }
    }, [user, fetchPrescriptions]);

    const fetchPrescriptions = React.useCallback(async () => {
        try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists() && userDoc.data().prescriptions) {
                setPrescriptions(userDoc.data().prescriptions);
            }
        } catch (error) {
            console.error("Error fetching prescriptions", error);
            toast.error("Failed to load prescriptions");
        } finally {
            setLoading(false);
        }
    }, [user.uid]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this prescription?")) return;
        
        try {
            const updatedList = prescriptions.filter(p => p.id !== id);
            await updateDoc(doc(db, 'users', user.uid), {
                prescriptions: updatedList
            });
            setPrescriptions(updatedList);
            toast.success("Prescription deleted");
        } catch (deleteError) {
            console.error("Error deleting prescription:", deleteError);
            toast.error("Failed to delete");
        }
    };


    if (loading) return <div>Loading prescriptions...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-serif font-bold">My Prescriptions</h1>
                <Button onClick={() => setIsAdding(!isAdding)}>
                    {isAdding ? "Cancel" : "Add New Prescription"}
                </Button>
            </div>

            {isAdding && (
                <div className="mb-8 border p-4 rounded-lg bg-white shadow-sm">
                    {/* We pass a dummy handler for validation change as we don't need it for 'adding' mode immediately, 
                        but PrescriptionForm requires it. */}
                    <PrescriptionForm 
                        onValidationChange={() => {}} 
                    />
                    <p className="text-sm text-gray-500 mt-4 text-center">
                        (Click "Save to Profile" inside the form to save)
                    </p>
                    <div className="flex justify-end mt-2">
                        <Button variant="ghost" onClick={() => {
                            setIsAdding(false);
                            fetchPrescriptions(); // Refresh to see new one
                        }}>Done</Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.length === 0 && !isAdding && (
                    <div className="col-span-2 text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                        <FileText size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No saved prescriptions found.</p>
                        <p className="text-sm">Add one to speed up your checkout process.</p>
                    </div>
                )}

                {prescriptions.map((p) => (
                    <Card key={p.id} className="p-4 relative hover:shadow-md transition-shadow">
                        <div className="absolute top-4 right-4">
                            <button 
                                onClick={() => handleDelete(p.id)}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2 pr-8">{p.name}</h3>
                        <p className="text-sm text-gray-500 mb-4">ID: {p.id.slice(-6)}</p>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-blue-50 p-2 rounded">
                                <strong className="block text-blue-700 mb-1">Right Eye (OD)</strong>
                                <div>SPH: {p.od.sph}</div>
                                <div>CYL: {p.od.cyl}</div>
                                <div>Axis: {p.od.axis}</div>
                                {p.od.add && <div>Add: {p.od.add}</div>}
                            </div>
                            <div className="bg-green-50 p-2 rounded">
                                <strong className="block text-green-700 mb-1">Left Eye (OS)</strong>
                                <div>SPH: {p.os.sph}</div>
                                <div>CYL: {p.os.cyl}</div>
                                <div>Axis: {p.os.axis}</div>
                                {p.os.add && <div>Add: {p.os.add}</div>}
                            </div>
                        </div>
                        <div className="mt-4 pt-2 border-t flex justify-between items-center">
                             <span className="font-medium">PD: {p.pd} mm</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Prescriptions;
