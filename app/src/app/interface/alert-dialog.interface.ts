export interface AlertDialog {
    header: string;
    subHeader?: string;
    message: string;

    buttons: AlertButton[] | string[]
}

export interface AlertButton {
    text: string;
    role: string;
}