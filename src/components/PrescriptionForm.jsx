import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PrescriptionForm = ({ onValidationChange, initialData = null }) => {
    const { user } = useAuth();
    const [prescription, setPrescription] = useState({
        name: 'My Prescription',
        od: { sph: '', cyl: '', axis: '', add: '' },
        os: { sph: '', cyl: '', axis: '', add: '' },
        pd: ''
    });
    const [savedPrescriptions, setSavedPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setPrescription(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!user) return;
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists() && userDoc.data().prescriptions) {
                    setSavedPrescriptions(userDoc.data().prescriptions);
                }
            } catch (err) {
                console.error("Error fetching prescriptions:", err);
            }
        };
        fetchPrescriptions();
    }, [user]);

    const validate = (data) => {
        // Simple validation logic
        const isValidNumber = (val) => val === '' || !isNaN(parseFloat(val));
        const isValidAxis = (val) => val === '' || (parseInt(val) >= 0 && parseInt(val) <= 180);
        
        const valid = 
            isValidNumber(data.od.sph) && isValidNumber(data.od.cyl) && isValidAxis(data.od.axis) &&
            isValidNumber(data.os.sph) && isValidNumber(data.os.cyl) && isValidAxis(data.os.axis) &&
            isValidNumber(data.pd) && data.pd !== '';
        
        onValidationChange(valid ? data : null);
        return valid;
    };

    const handleChange = (eye, field, value) => {
        const newData = { ...prescription };
        if (eye === 'root') {
            newData[field] = value;
        } else {
            newData[eye][field] = value;
        }
        setPrescription(newData);
        validate(newData);
    };

    const loadPrescription = (id) => {
        const selected = savedPrescriptions.find(p => p.id === id);
        if (selected) {
            setPrescription(selected);
            validate(selected);
            toast.success("Prescription loaded!");
        }
    };

    const saveToProfile = async () => {
        if (!user) {
            toast.error("Please login to save prescription");
            return;
        }
        if (!validate(prescription)) {
            toast.error("Invalid prescription data");
            return;
        }
        
        setLoading(true);
        try {
            const newPrescription = { ...prescription, id: Date.now().toString() };
            await updateDoc(doc(db, 'users', user.uid), {
                prescriptions: arrayUnion(newPrescription)
            });
            setSavedPrescriptions([...savedPrescriptions, newPrescription]);
            toast.success("Prescription saved to profile!");
        } catch (error) {
            console.error("Error saving prescription:", error);
            toast.error("Failed to save prescription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="prescription-form space-y-6 p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Enter Prescription</h3>
                {user && savedPrescriptions.length > 0 && (
                     <Select onValueChange={loadPrescription}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Load saved..." />
                        </SelectTrigger>
                        <SelectContent>
                            {savedPrescriptions.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Right Eye (OD) */}
                <div className="space-y-4">
                    <h4 className="font-medium text-blue-600">Right Eye (OD)</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Sphere (SPH)</Label>
                            <Input 
                                placeholder="-0.00" 
                                value={prescription.od.sph}
                                onChange={(e) => handleChange('od', 'sph', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Cylinder (CYL)</Label>
                            <Input 
                                placeholder="-0.00" 
                                value={prescription.od.cyl}
                                onChange={(e) => handleChange('od', 'cyl', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Axis (0-180)</Label>
                            <Input 
                                placeholder="180" 
                                type="number"
                                min="0" max="180"
                                value={prescription.od.axis}
                                onChange={(e) => handleChange('od', 'axis', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Add (NV)</Label>
                            <Input 
                                placeholder="+0.00" 
                                value={prescription.od.add}
                                onChange={(e) => handleChange('od', 'add', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Left Eye (OS) */}
                <div className="space-y-4">
                    <h4 className="font-medium text-green-600">Left Eye (OS)</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Sphere (SPH)</Label>
                            <Input 
                                placeholder="-0.00" 
                                value={prescription.os.sph}
                                onChange={(e) => handleChange('os', 'sph', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Cylinder (CYL)</Label>
                            <Input 
                                placeholder="-0.00" 
                                value={prescription.os.cyl}
                                onChange={(e) => handleChange('os', 'cyl', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Axis (0-180)</Label>
                            <Input 
                                placeholder="180" 
                                type="number"
                                min="0" max="180"
                                value={prescription.os.axis}
                                onChange={(e) => handleChange('os', 'axis', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Add (NV)</Label>
                            <Input 
                                placeholder="+0.00" 
                                value={prescription.os.add}
                                onChange={(e) => handleChange('os', 'add', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 items-end">
                <div className="w-32">
                    <Label>PD (Pupillary Distance)</Label>
                    <Input 
                        placeholder="63" 
                        value={prescription.pd}
                        onChange={(e) => handleChange('root', 'pd', e.target.value)}
                    />
                </div>
                <div className="flex-1">
                    <Label>Prescription Name (for saving)</Label>
                    <Input 
                        placeholder="e.g. My Reading Glasses" 
                        value={prescription.name}
                        onChange={(e) => handleChange('root', 'name', e.target.value)}
                    />
                </div>
                {user && (
                    <Button variant="outline" onClick={saveToProfile} disabled={loading}>
                        {loading ? "Saving..." : "Save to Profile"}
                    </Button>
                )}
            </div>
            {!user && (
                <p className="text-xs text-gray-500 italic">Log in to save this prescription for future orders.</p>
            )}
        </div>
    );
};

export default PrescriptionForm;
