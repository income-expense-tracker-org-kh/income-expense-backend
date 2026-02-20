import { useState, useCallback } from 'react';

export function useConfirm() {
    const [state, setState] = useState({
        isOpen: false,
        title: '',
        message: '',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
        variant: 'danger',
        resolve: null,
    });

    const confirm = useCallback(
        ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'danger' } = {}) =>
            new Promise((resolve) => {
                setState({ isOpen: true, title, message, confirmText, cancelText, variant, resolve });
            }),
        []
    );

    const handleConfirm = useCallback(() => {
        setState((s) => {
            s.resolve?.(true);
            return { ...s, isOpen: false };
        });
    }, []);

    const handleClose = useCallback(() => {
        setState((s) => {
            s.resolve?.(false);
            return { ...s, isOpen: false };
        });
    }, []);

    const confirmProps = {
        isOpen: state.isOpen,
        title: state.title,
        message: state.message,
        confirmText: state.confirmText,
        cancelText: state.cancelText,
        variant: state.variant,
        onConfirm: handleConfirm,
        onClose: handleClose,
    };

    return { confirm, confirmProps };
}