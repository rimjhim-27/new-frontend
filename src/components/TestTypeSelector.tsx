// src/components/TestTypeSelector.tsx
import { useEffect, useState } from 'react';
import { TestTypeService } from '../lib/test-types';
import { MedicalTest } from '../types/test-types';

export function TestTypeSelector({ onSelect }: { onSelect: (test: MedicalTest) => void }) {
  const [tests, setTests] = useState<MedicalTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const availableTests = await TestTypeService.getActiveTests();
        setTests(availableTests);
      } catch (error) {
        console.error('Failed to load tests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  if (loading) return <div>Loading tests...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Test Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((test) => (
          <div 
            key={test.id}
            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect(test)}
          >
            <h4 className="font-medium">{test.name}</h4>
            <p className="text-sm text-gray-600">{test.category}</p>
            <p className="text-sm mt-2">{test.description}</p>
            <div className="mt-2 text-sm">
              <span className="font-medium">Price:</span> ₹{test.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}