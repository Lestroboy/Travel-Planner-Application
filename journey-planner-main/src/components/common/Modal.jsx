import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { motion } from "framer-motion";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "default",
  showClose = true,
}) => {
  const sizeClasses = {
    small: "max-w-md",
    default: "max-w-lg",
    large: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-background p-6 shadow-2xl transition-all`}
              >
                {/* Header */}
                {(title || showClose) && (
                  <div className="flex items-center justify-between mb-6">
                    {title && (
                      <Dialog.Title className="text-xl font-heading font-semibold">
                        {title}
                      </Dialog.Title>
                    )}
                    {showClose && (
                      <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Content */}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}) => {
  const buttonVariants = {
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    primary: "btn-primary",
    secondary: "btn-secondary",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small" title={title}>
      <p className="text-muted-foreground mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-ghost">
          {cancelText}
        </button>
        <button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${buttonVariants[variant]}`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export const SlideOver = ({ isOpen, onClose, title, children, position = "right" }) => {
  const positionClasses = {
    right: "right-0",
    left: "left-0",
  };

  const slideDirection = position === "right" ? "100%" : "-100%";

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300"
            enterFrom={`translate-x-[${slideDirection}]`}
            enterTo="translate-x-0"
            leave="transform transition ease-in duration-200"
            leaveFrom="translate-x-0"
            leaveTo={`translate-x-[${slideDirection}]`}
          >
            <Dialog.Panel
              className={`fixed top-0 ${positionClasses[position]} h-full w-full max-w-md bg-background shadow-2xl`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                {title && (
                  <Dialog.Title className="text-lg font-heading font-semibold">
                    {title}
                  </Dialog.Title>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">{children}</div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
