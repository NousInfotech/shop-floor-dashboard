
// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Employee } from '@/types/employee';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { 
//   CURRENCIES, 
//   DEPARTMENTS, 
//   EMPLOYEE_STATUSES, 
//   EMPLOYMENT_TYPES, 
//   RATE_TYPES, 
//   SHIFT_TYPES 
// } from '@/lib/utils/constants';
// import { generateEmployeeCode } from '@/lib/utils/helpers';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { UploadIcon } from 'lucide-react';

// interface AddEmployeeFormProps {
//   onSubmit: (employee: Omit<Employee, 'id'>) => void;
// }

// export default function AddEmployeeForm({ onSubmit }: AddEmployeeFormProps) {
//   const [activeTab, setActiveTab] = useState('basic');
//   const [photoFile, setPhotoFile] = useState<File | null>(null);
//   const [photoPreview, setPhotoPreview] = useState<string | null>(null);

//   const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
//     employeeCode: generateEmployeeCode(),
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     address: '',
//     site: 'Main Factory',
//     siteCode: 'MAIN',
//     employmentType: 'Full-time',
//     status: 'Active',
//     shift: 'Morning',
//     role: '',
//     department: '',
//     position: '',
//     payment: {
//       currency: 'USD',
//       rateType: 'Hourly',
//       unitCost: 0,
//     }
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   const { name, value } = e.target;

//   if (name.includes('.')) {
//     const [parent, child] = name.split('.');

//     setFormData((prev) => {
//       const parentValue = prev[parent as keyof typeof prev];

//       return {
//         ...prev,
//         [parent]: {
//           ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
//           [child]: value
//         }
//       };
//     });
//   } else {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   }
// };

// const handleSelectChange = (name: string, value: string) => {
//   if (name.includes('.')) {
//     const [parent, child] = name.split('.');

//     setFormData((prev) => {
//       const parentValue = prev[parent as keyof typeof prev];

//       return {
//         ...prev,
//         [parent]: {
//           ...(typeof parentValue === 'object' && parentValue !== null ? parentValue : {}),
//           [child]: value
//         }
//       };
//     });
//   } else {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   }
// };


//   const handleUnitCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = parseFloat(e.target.value);
//     setFormData((prev) => ({
//       ...prev,
//       payment: {
//         ...prev.payment,
//         unitCost: isNaN(value) ? 0 : value
//       }
//     }));
//   };

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setPhotoFile(file);
      
//       const reader = new FileReader();
//       reader.onload = () => {
//         setPhotoPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     const employeeData = {
//       ...formData,
//       ...(photoPreview && { photo: photoPreview })
//     };
    
//     onSubmit(employeeData);
//   };

//   const nextTab = () => {
//     if (activeTab === 'basic') setActiveTab('contactRole');
//     else if (activeTab === 'contactRole') setActiveTab('payment');
//   };

//   const prevTab = () => {
//     if (activeTab === 'payment') setActiveTab('contactRole');
//     else if (activeTab === 'contactRole') setActiveTab('basic');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="space-y-6">
//         <div>
//           <h2 className="text-lg font-medium">Add Employee</h2>
//           <p className="text-sm text-gray-500">
//             Enter the basic employee information below. You can add more details later by editing the employee.
//           </p>
//         </div>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="basic">Employee Information</TabsTrigger>
//             <TabsTrigger value="contactRole">Contact & Role</TabsTrigger>
//             <TabsTrigger value="payment">Payment Details</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="basic" className="space-y-4 pt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="employeeCode">Employee Code*</Label>
//                 <Input
//                   id="employeeCode"
//                   name="employeeCode"
//                   value={formData.employeeCode}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="site">Site*</Label>
//                 <Select 
//                   value={formData.site} 
//                   onValueChange={(value) => handleSelectChange('site', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select site" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Main Factory">Main Factory</SelectItem>
//                     <SelectItem value="Branch Office">Branch Office</SelectItem>
//                     <SelectItem value="Distribution Center">Distribution Center</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="firstName">First Name*</Label>
//                 <Input
//                   id="firstName"
//                   name="firstName"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="lastName">Last Name*</Label>
//                 <Input
//                   id="lastName"
//                   name="lastName"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="siteCode">Site Code*</Label>
//                 <Input
//                   id="siteCode"
//                   name="siteCode"
//                   value={formData.siteCode}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="employmentType">Employment Type</Label>
//                 <Select 
//                   value={formData.employmentType} 
//                   onValueChange={(value) => handleSelectChange('employmentType', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {EMPLOYMENT_TYPES.map(type => (
//                       <SelectItem key={type} value={type}>{type}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="status">Status</Label>
//                 <Select 
//                   value={formData.status} 
//                   onValueChange={(value) => handleSelectChange('status', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {EMPLOYEE_STATUSES.map(status => (
//                       <SelectItem key={status} value={status}>{status}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="shift">Shift*</Label>
//                 <Select 
//                   value={formData.shift} 
//                   onValueChange={(value) => handleSelectChange('shift', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select shift" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {SHIFT_TYPES.map(shift => (
//                       <SelectItem key={shift} value={shift}>{shift}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
            
//             <div className="flex justify-end">
//               <Button type="button" onClick={nextTab}>
//                 Next
//               </Button>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="contactRole" className="space-y-4 pt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email*</Label>
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Phone*</Label>
//                   <Input
//                     id="phone"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="address">Address*</Label>
//                   <Input
//                     id="address"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="role">Role*</Label>
//                   <Input
//                     id="role"
//                     name="role"
//                     value={formData.role}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="department">Department</Label>
//                   <Select 
//                     value={formData.department} 
//                     onValueChange={(value) => handleSelectChange('department', value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select department" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {DEPARTMENTS.map(dept => (
//                         <SelectItem key={dept} value={dept}>{dept}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <div className="space-y-2">
//                   <Label htmlFor="position">Position</Label>
//                   <Input
//                     id="position"
//                     name="position"
//                     value={formData.position}
//                     onChange={handleChange}
//                   />
//                 </div>
//               </div>
//             </div>
            
//             <div className="space-y-4">
//               <div>
//                 <Label>Employee Photo</Label>
//                 <div className="flex items-center space-x-4 mt-2">
//                   <Avatar className="h-16 w-16">
//                     <AvatarImage src={photoPreview || undefined} />
//                     <AvatarFallback>
//                       {formData.firstName ? formData.firstName.charAt(0) : ''}
//                       {formData.lastName ? formData.lastName.charAt(0) : ''}
//                     </AvatarFallback>
//                   </Avatar>
                  
//                   <div>
//                     <Button 
//                       type="button" 
//                       variant="outline" 
//                       className="flex items-center"
//                       onClick={() => document.getElementById('photo-upload')?.click()}
//                     >
//                       <UploadIcon className="mr-2 h-4 w-4" />
//                       Upload
//                     </Button>
//                     <Input
//                       id="photo-upload"
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handlePhotoChange}
//                     />
//                     <p className="text-xs text-gray-500 mt-1">
//                       PNG, JPG or GIF up to 2MB
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex justify-between">
//               <Button type="button" variant="outline" onClick={prevTab}>
//                 Previous
//               </Button>
//               <Button type="button" onClick={nextTab}>
//                 Next
//               </Button>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="payment" className="space-y-4 pt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="payment.currency">Currency*</Label>
//                 <Select 
//                   value={formData.payment.currency} 
//                   onValueChange={(value) => handleSelectChange('payment.currency', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select currency" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {CURRENCIES.map(currency => (
//                       <SelectItem key={currency} value={currency}>{currency}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="payment.rateType">Rate Type*</Label>
//                 <Select 
//                   value={formData.payment.rateType} 
//                   onValueChange={(value) => handleSelectChange('payment.rateType', value)}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select rate type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {RATE_TYPES.map(type => (
//                       <SelectItem key={type} value={type}>{type}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="payment.unitCost">Unit Cost*</Label>
//                 <div className="relative">
//                  <span className="absolute left-3 top-2.5 text-gray-500">
//   {formData.payment.currency === 'USD' ? '$' : formData.payment.currency}
// </span>

//                   <Input
//                     id="payment.unitCost"
//                     name="payment.unitCost"
//                     type="number"
//                     value={formData.payment.unitCost || ''}
//                     onChange={handleUnitCostChange}
//                     className="pl-8"
//                     required
//                   />
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="payment.locationId">Location ID</Label>
//                 <Input
//                   id="payment.locationId"
//                   name="payment.locationId"
//                   value={formData.payment.locationId || ''}
//                   onChange={(e) => handleSelectChange('payment.locationId', e.target.value)}
//                 />
//               </div>
//             </div>
            
//             <div className="flex justify-between">
//               <Button type="button" variant="outline" onClick={prevTab}>
//                 Previous
//               </Button>
//               <Button type="submit">
//                 Add Employee
//               </Button>
//             </div>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </form>
//   );
// }
