import {ConfigProvider, Modal, ModalProps} from 'antd'

interface IProps extends ModalProps {}

export const AppModal = ({ ...props }: IProps)=>{
    return(
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "",
                    colorPrimary:"#16A34A"
                },

            }}
        >
            <Modal {...props}>

            </Modal>
        </ConfigProvider>
    )
}