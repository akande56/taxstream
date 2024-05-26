import { PlusIcon } from "lucide-react";
import { AppButton } from "./app/button";
import { AppSelect } from "./app/select";
import { AppTable } from "./app/table";
import { AppInput } from "./app/input";
import { useState } from "react";

const columns: any[] = [
  {
    title: '#',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: 'Full Name',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: 'Staff ID',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Role',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Location',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Phone Number',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Status',
    key: 'state',
    render: (val: any) => (
      <div className="flex items-center gap-3 text-primary text-sm">
        <button className={`${val == 0 && 'text-red-500'}`}>{val == 0 ? 'Inactive' : 'Active'}</button>
        <button>Edit</button>
        <button>View</button>
      </div>
    ),
  },
];

const StaffEnrollment = () => {
  const [getFilterValue, setFilterValue] = useState<string>("");
  const [getSearch, setSearch] = useState<string>("");

  const handleFilterChange = (e:any)=>{
    setFilterValue(e.target.value);
  }

  const handleSearchChange = (e:any)=>{
    setSearch(e.target.value);
  }

  return (
    <div className="h-full p-10">
      <div className="w-full shadow-lg h-full border">
          <div className="flex px-5 py-3 border-b gap-1">
            <AppButton label="Add Staff" icon={<PlusIcon/>}/>
            <AppSelect placeholder="Filter By" selectValue={getFilterValue} onChangeValue={handleFilterChange} options={[{label: "Test 1", value: "test-1"}, {label: "Test 2", value: "test-2"}]}/>
            <AppInput placeholder="Search" inputValue={getSearch} onChangeValue={handleSearchChange}/>
          </div>
          <AppTable
          columns={columns}
          pagination={false}
          />
      </div>
    </div>
  );
};

export default StaffEnrollment;
