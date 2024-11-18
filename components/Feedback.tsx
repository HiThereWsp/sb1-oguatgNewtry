"use client"

import React, { useState, memo, useCallback } from 'react';

// Types
type FeedbackType = 'positive' | 'negative';

interface FeedbackProps {
  onFeedback?: (type: FeedbackType, comment?: string) => void;
  onCopy?: () => void;
  onRestart?: () => void;
  className?: string;
}

// SVG Icons as components
const ThumbUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 10v12" />
    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
  </svg>
);

const ThumbDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 14V2" />
    <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const RestartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);

// Composants atomiques memoïsés
const IconButton = memo(({ 
  icon: Icon, 
  onClick, 
  className = '',
  disabled = false 
}: { 
  icon: React.ElementType;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    className={`p-2 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    <Icon />
  </button>
));

const FeedbackDialog = memo(({ 
  onClose, 
  onSubmit, 
  type 
}: { 
  onClose: () => void;
  onSubmit: (comment: string) => void;
  type: FeedbackType;
}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = useCallback(() => {
    onSubmit(comment);
    onClose();
  }, [comment, onSubmit, onClose]);

  const handleSkip = useCallback(() => {
    onSubmit('');
    onClose();
  }, [onSubmit, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-in-out]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl animate-[slideIn_0.2s_ease-out]" 
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold mb-2">
          {type === 'positive' ? '✨ Merci pour votre retour positif !' : '💭 Merci de nous aider à nous améliorer'}
        </h3>
        <p className="text-gray-600 mb-4">
          Souhaitez-vous nous en dire plus ?
        </p>
        <textarea
          placeholder="Votre retour (facultatif)..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full min-h-[100px] p-2 border rounded-md mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button 
            type="button"
            className="px-4 py-2 rounded-md border hover:bg-gray-50 transition-colors"
            onClick={handleSkip}
          >
            Passer
          </button>
          <button 
            type="button"
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            onClick={handleSubmit}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
});

// Composant principal optimisé
const Feedback = memo(({
  onFeedback = () => {},
  onCopy = () => {},
  onRestart = () => {},
  className = ''
}: FeedbackProps) => {
  const [feedbackSent, setFeedbackSent] = useState<FeedbackType | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleFeedback = useCallback((type: FeedbackType) => {
    setFeedbackSent(type);
    setShowDialog(true);
  }, []);

  const handleFeedbackSubmit = useCallback((comment: string) => {
    onFeedback(feedbackSent!, comment);
    setShowDialog(false);
  }, [feedbackSent, onFeedback]);

  const handleCopy = useCallback(() => {
    onCopy();
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 1500);
  }, [onCopy]);

  return (
    <div className={`flex items-center gap-2 text-sm border-t pt-4 ${className}`}>
      <div className="flex-1 flex items-center gap-2">
        <IconButton
          icon={copySuccess ? CheckIcon : CopyIcon}
          onClick={handleCopy}
          className={copySuccess ? 'text-green-600' : 'text-gray-600'}
        />
        <IconButton
          icon={RestartIcon}
          onClick={onRestart}
          className="text-gray-600"
        />
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <span className="text-xs select-none">Utile ?</span>
        <IconButton
          icon={ThumbUpIcon}
          onClick={() => handleFeedback('positive')}
          className={feedbackSent === 'positive' ? 'text-green-600' : ''}
          disabled={feedbackSent !== null}
        />
        <IconButton
          icon={ThumbDownIcon}
          onClick={() => handleFeedback('negative')}
          className={feedbackSent === 'negative' ? 'text-red-600' : ''}
          disabled={feedbackSent !== null}
        />
      </div>

      {showDialog && (
        <FeedbackDialog
          type={feedbackSent!}
          onClose={() => setShowDialog(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </div>
  );
});

export default Feedback;