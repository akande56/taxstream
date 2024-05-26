import {Table, TableProps, ConfigProvider} from 'antd'

export const AppTable = (props: TableProps)=>{
    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: ''
                }
            }}
        >
            <Table {...props}/>
        </ConfigProvider>
    )
}