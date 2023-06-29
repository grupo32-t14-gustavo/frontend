'use client'
import { ModalContext } from "@/context/modalContext";
import { useContext, useEffect, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai"

import "../../styles/components/modals/modal.sass"
import Button from "../button/button";

interface iModalProps{
    children?: React.ReactNode;
    title?: string;
    className?: string
}

const Modal = ({children, title, className}: iModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const { setResetPasswordModal, setCreateAdvertModal, createAdvertModal, setCarImageModal } = useContext(ModalContext)

    const closeModal = () => {
        setResetPasswordModal(false)
        setCreateAdvertModal(false)
        setCarImageModal(false)
    }
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal()
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return(
        <div className="modal-bg">
            <div ref={modalRef} className={`modal ${className}`}>
                <header>
                    <h2>{title}</h2>
                    <Button onClick={closeModal}>
                        <AiOutlineClose/>
                    </Button>
                </header>
                {children}
            </div>
        </div>
    )
}

export default Modal