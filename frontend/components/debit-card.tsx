export default function DebitCard() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-georgel-purple rounded-xl p-6 text-white">
        <div className="flex justify-between items-start mb-6">
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
        <div className="flex flex-col mb-6">
          <span className="text-sm opacity-75 mb-1">Card Number</span>
          <span className="font-mono">**** **** **** 4289</span>
        </div>
        <div className="flex justify-between">
          <div>
            <span className="text-sm opacity-75 block mb-1">Card Holder</span>
            <span>Jasmine Asare</span>
          </div>
          <div className="text-right">
            <span className="text-sm opacity-75 block mb-1">Expires</span>
            <span>12/27</span>
          </div>
        </div>
      </div>
    </div>
  )
}
