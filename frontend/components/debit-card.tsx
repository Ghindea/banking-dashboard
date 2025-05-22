import { formatCurrency } from "@/utilis/dashboard-data"

interface DebitCardProps {
  balance?: number
  cardNumber?: string
  holderName?: string
  expiryDate?: string
}

export default function DebitCard({ 
  balance = 0, 
  cardNumber = "4289",
  holderName = "Jasmine Asare",
  expiryDate = "12/27"
}: DebitCardProps) {
  return (
    <div className="w-full">
      {/* Card container with proper aspect ratio and corner radius */}
      <div
        className="text-white rounded-lg shadow-lg overflow-hidden relative"
        style={{
          aspectRatio: "311/185", // Aspect ratio from SVG
          borderRadius: "20px",   // Exact corner radius from SVG
          width: "100%",         
          maxWidth: "360px",     
          background: "linear-gradient(135deg, #7763EA 20.6%, #6393EA 92.8%)", // Exact gradient from SVG
          position: "relative"
        }}
      >
        {/* Instead of using clip-path which can be tricky with scaling, create a custom SVG path element */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 311 185"
          style={{ zIndex: "1" }}
        >
          <path 
            d="M0 23.9265C2.87056 49.8774 49.5236 63.0827 129.931 75.7097C276.414 98.7132 313.25 144.921 301.465 185H20C8.95431 185 0 176.045 0 165V23.9265ZM0.610352 15.0798C0.434706 15.8381 0.291527 16.5868 0.177734 17.3259C0.279712 16.5627 0.424815 15.8132 0.610352 15.0798Z"
            fill="rgba(255, 255, 255, 0.08)" 
          />
        </svg>
        
        {/* Subtle gaussian blur overlay from SVG */}
        <div 
          className="absolute inset-0 bg-white opacity-5 rounded-lg"
          style={{ zIndex: "2" }}
        />

        <div className="p-6 h-full flex flex-col justify-between relative z-10">
          {/* Card header with logo/type */}
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">Debit</span>
            <div className="text-right">
              <svg width="48" height="16" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M44 0H4C1.79086 0 0 1.79086 0 4V12C0 14.2091 1.79086 16 4 16H44C46.2091 16 48 14.2091 48 12V4C48 1.79086 46.2091 0 44 0Z"
                  fill="white"
                />
                <path d="M17 12H22V4H17V12Z" fill="#FF5F00" />
                <path
                  d="M17.5 8C17.5 6.4 18.3 5 19.5 4C18.3 3 16.8 2.5 15 2.5C11.9 2.5 9.5 5 9.5 8C9.5 11 11.9 13.5 15 13.5C16.8 13.5 18.3 13 19.5 12C18.3 11 17.5 9.6 17.5 8Z"
                  fill="#EB001B"
                />
                <path
                  d="M30 8C30 11 27.6 13.5 24.5 13.5C22.7 13.5 21.2 13 20 12C21.2 11 22 9.6 22 8C22 6.4 21.2 5 20 4C21.2 3 22.7 2.5 24.5 2.5C27.6 2.5 30 5 30 8Z"
                  fill="#F79E1B"
                />
              </svg>
            </div>
          </div>

          {/* Card number */}
          <div className="my-6">
            <span className="text-sm opacity-75 block mb-1">Card Number</span>
            <span className="font-mono text-lg">**** **** **** {cardNumber}</span>
          </div>

          {/* Card footer with name, expiry, and balance */}
          <div className="flex justify-between items-end">
            <div>
              <span className="text-sm opacity-75 block mb-1">Card Holder</span>
              <span>{holderName}</span>
            </div>
            <div className="text-right">
              <span className="text-sm opacity-75 block mb-1">Balance</span>
              <span className="font-semibold">{formatCurrency(balance)}</span>
            </div>
            <div className="text-right">
              <span className="text-sm opacity-75 block mb-1">Expires</span>
              <span>{expiryDate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}