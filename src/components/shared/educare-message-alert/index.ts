import { notification as Notification } from 'antd';
import type { ArgsProps } from 'antd/lib/notification/interface';

const key = '__educare_alert';
const EducareMessageAlert = (message: string, type: ArgsProps['type'] = 'success', duration: ArgsProps['duration'] = 3) => {
    Notification[type]({
        key,
        duration,
        message: '',
        description: message,
        role: 'alert',
        className: '!mb-0 !pt-2 !pb-4 !px-2',
        placement: 'bottomRight',
    });
};

export default EducareMessageAlert;
