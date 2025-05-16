import { OrganSystem, TestResult } from '../types';

// Simulate API call to process a medical report
export const mockProcessReport = async (file: File): Promise<OrganSystem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock data for organ systems and test results
  return [
    {
      id: '1',
      name: 'Kidney Function',
      status: 'normal',
      icon: 'kidney',
      tests: [
        {
          id: '101',
          name: 'Creatinine',
          value: 0.9,
          unit: 'mg/dL',
          referenceRange: '0.7-1.3',
          status: 'normal',
        },
        {
          id: '102',
          name: 'Blood Urea Nitrogen (BUN)',
          value: 14,
          unit: 'mg/dL',
          referenceRange: '7-20',
          status: 'normal',
        },
        {
          id: '103',
          name: 'eGFR',
          value: 98,
          unit: 'mL/min/1.73m²',
          referenceRange: '>60',
          status: 'normal',
        }
      ]
    },
    {
      id: '2',
      name: 'Liver Function',
      status: 'borderline',
      icon: 'liver',
      tests: [
        {
          id: '201',
          name: 'ALT',
          value: 45,
          unit: 'U/L',
          referenceRange: '7-35',
          status: 'borderline',
          explanation: 'Slightly elevated ALT may indicate mild liver stress. This could be caused by medication, recent alcohol consumption, or fatty liver. Monitor and retest in 3 months.'
        },
        {
          id: '202',
          name: 'AST',
          value: 30,
          unit: 'U/L',
          referenceRange: '8-33',
          status: 'normal',
        },
        {
          id: '203',
          name: 'Albumin',
          value: 4.1,
          unit: 'g/dL',
          referenceRange: '3.5-5.0',
          status: 'normal',
        }
      ]
    },
    {
      id: '3',
      name: 'Pancreatic Function',
      status: 'critical',
      icon: 'pancreas',
      tests: [
        {
          id: '301',
          name: 'Lipase',
          value: 240,
          unit: 'U/L',
          referenceRange: '0-160',
          status: 'critical',
          explanation: 'Significantly elevated lipase suggests pancreatic inflammation (pancreatitis). This requires prompt medical attention to identify the cause and provide appropriate treatment.'
        },
        {
          id: '302',
          name: 'Amylase',
          value: 190,
          unit: 'U/L',
          referenceRange: '30-110',
          status: 'critical',
          explanation: 'Elevated amylase, especially in combination with elevated lipase, strongly indicates pancreatic inflammation. Recommend consulting with a healthcare provider promptly.'
        }
      ]
    },
    {
      id: '4',
      name: 'Thyroid Function',
      status: 'normal',
      icon: 'thyroid',
      tests: [
        {
          id: '401',
          name: 'TSH',
          value: 1.8,
          unit: 'mIU/L',
          referenceRange: '0.4-4.0',
          status: 'normal',
        },
        {
          id: '402',
          name: 'Free T4',
          value: 1.2,
          unit: 'ng/dL',
          referenceRange: '0.8-1.8',
          status: 'normal',
        }
      ]
    },
    {
      id: '5',
      name: 'Complete Blood Count',
      status: 'borderline',
      icon: 'blood',
      tests: [
        {
          id: '501',
          name: 'Hemoglobin',
          value: 13.2,
          unit: 'g/dL',
          referenceRange: '13.5-17.5',
          status: 'borderline',
          explanation: 'Slightly low hemoglobin may indicate mild anemia. Consider dietary changes to increase iron intake, such as eating more red meat, spinach, and legumes.'
        },
        {
          id: '502',
          name: 'White Blood Cells',
          value: 7.5,
          unit: 'K/µL',
          referenceRange: '4.5-11.0',
          status: 'normal',
        },
        {
          id: '503',
          name: 'Platelets',
          value: 250,
          unit: 'K/µL',
          referenceRange: '150-450',
          status: 'normal',
        }
      ]
    }
  ];
};