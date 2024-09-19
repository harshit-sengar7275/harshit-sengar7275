'use client'
import Image from "next/image"
import { useEffect } from "react";
import Link from "next/link";
import { useState } from 'react';


const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyBcJBgB2Th8GcuT0WoKLz4GqwiBZHDtUZ4");

async function run(prompt: string, setWrite: any, setStyle: any, chats: any, setChat: any,setChange: any) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  let text = '';
  const newChats = chats; // Create a new array to avoid directly modifying state

  setChat([...newChats, {"type": "system", "body": `...` }]);

  const lastIndex = newChats.length; // Use newChats instead of chats

  const result = await model.generateContentStream([prompt]);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    text += chunkText;
    console.log(text)
    newChats[lastIndex] = {"type": "system", "body": text}; // Update newChats array
    setChat(newChats); // Set the updated array
  }

  newChats[lastIndex] = {"type": "system", "body": text};
  setChat(newChats);

  setWrite(false);
  setStyle({ height: "66px", overflow: "hidden" });
  console.log(text);
}

// run();

interface ChatMessage {
  type: string;
  body: string;
}


export default function Home() {  
  const [prompt, setPrompt] = useState('');
  const [change, setChange] = useState('');
  const [chats, setChat] = useState<ChatMessage[]>([]);
  const [write, setWrite] = useState(false);
  const [txtStyle, setStyle] = useState({ height: '66px !important', overflow: 'hidden' });
  const [msg, setMsg] = useState([
    { "name": "user", "body": "Hi" }
  ]);
  const send_msg = () => {
    if (write === false) {
      const newChats = chats
      newChats.push({"type": "user", "body": prompt})
      setChat(newChats);
      console.log(chats)
      setWrite(true)
      run(prompt, setWrite, setStyle, chats, setChat,setChange)
      setPrompt('')
    }


  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key == "Enter" && prompt != "") {
      event.preventDefault()
      send_msg()

    }

  }

  useEffect(() => {


    const textarea = document.getElementById("chat-input-box");
    const autoResize = () => {
      if (textarea) {

        textarea.style.height = textarea.scrollHeight + 'px';
      }
    }


    autoResize(); // Call the function immediately to resize the textarea on mount
    if (textarea) {

      textarea.addEventListener('input', autoResize); // Listen for input events to resize the textarea dynamically
    }

    // Attach event listener after component mounts on the client-side
    const handleClick = () => {
      const nav1 = document.getElementById('nav1')
      if (nav1?.getAttribute('data-state') == "close") {
        nav1?.setAttribute('data-state', 'open')
        return
      }
      if (nav1?.getAttribute('data-state') == "open") {
        nav1?.setAttribute('data-state', 'close')
      }
    };

    const handleClick2 = () => {
      const nav2 = document.getElementById('nav2')
      if (nav2?.style.display == "none") {
        nav2.style.display = "block"
        return
      }
      if (nav2?.style.display == "block") {
        nav2.style.display = "none"

      }

    };

    // Find the button element and attach click event listener
    const button = document.getElementById('btn_nav1');
    const button2 = document.getElementById('btn_nav2');
    const button3 = document.getElementById('btn_nav3');
    if (button) {
      button.addEventListener('click', handleClick);
    }
    if (button2) {
      button2.addEventListener('click', handleClick2);
    }
    if (button3) {
      button3.addEventListener('click', handleClick2);
    }

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener('input', autoResize); // Clean up the event listener on component unmount
      if (button) {
        button.removeEventListener('click', handleClick);
      }
      if (button2) {
        button2.removeEventListener('click', handleClick2);
      }
      if (button3) {
        button3.removeEventListener('click', handleClick2);
      }

    };

  }, []);

  return (

    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 bg-muted/50 backdrop-blur-xl" style={{ position: "fixed" }}>
        <div className="flex items-center">
          <button className="items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-none hover:bg-accent hover:text-accent-foreground flex p-0 -ml-2 h-9 w-9 lg:hidden" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="radix-:r3:" data-state="closed" id="btn_nav2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="w-6 h-6">
              <path d="M216 40H40a16 16 0 0 0-16 16v144a16 16 0 0 0 16 16h176a16 16 0 0 0 16-16V56a16 16 0 0 0-16-16ZM40 56h40v144H40Zm176 144H96V56h120v144Z" />
            </svg>
            <span className="sr-only">Toggle Sidebar</span>
          </button>
          <button className="items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-none hover:bg-accent hover:text-accent-foreground hidden p-0 -ml-2 h-9 w-9 lg:flex" id="btn_nav1">
            <svg strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <path d="M3 5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 19H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">Toggle Sidebar</span>
          </button>
          <Link rel="nofollow" className="ml-2" href="/">
            <Image alt="NaradAI" loading="lazy" width={40} height={32} decoding="async" className="invert-icon NaradAI-logo" src="/favicon.ico" style={{ color: 'transparent' }} />
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 px-4 py-2 mobile-hide-header-item">
            <svg className="h-4 w-4 mr-2" stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M881 442.4H519.7v148.5h206.4c-8.9 48-35.9 88.6-76.6 115.8-34.4 23-78.3 36.6-129.9 36.6-99.9 0-184.4-67.5-214.6-158.2-7.6-23-12-47.6-12-72.9s4.4-49.9 12-72.9c30.3-90.6 114.8-158.1 214.7-158.1 56.3 0 106.8 19.4 146.6 57.4l110-110.1c-66.5-62-153.2-100-256.6-100-149.9 0-279.6 86-342.7 211.4-26 51.8-40.8 110.4-40.8 172.4S151 632.8 177 684.6C240.1 810 369.8 896 519.7 896c103.6 0 190.4-34.4 253.8-93 72.5-66.8 114.4-165.2 114.4-282.1 0-27.2-2.4-53.3-6.9-78.5z" />
            </svg>Login </button>


          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 h-8 px-4 py-2 newchat-button-mobile">
            <svg width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.1464 1.14645C12.3417 0.951184 12.6583 0.951184 12.8535 1.14645L14.8535 3.14645C15.0488 3.34171 15.0488 3.65829 14.8535 3.85355L10.9109 7.79618C10.8349 7.87218 10.7471 7.93543 10.651 7.9835L6.72359 9.94721C6.53109 10.0435 6.29861 10.0057 6.14643 9.85355C5.99425 9.70137 5.95652 9.46889 6.05277 9.27639L8.01648 5.34897C8.06455 5.25283 8.1278 5.16507 8.2038 5.08907L12.1464 1.14645ZM12.5 2.20711L8.91091 5.79618L7.87266 7.87267L8.12731 8.12732L10.2038 7.08907L13.7929 3.5L12.5 2.20711ZM9.99998 2L8.99998 3H4.9C4.47171 3 4.18056 3.00039 3.95552 3.01877C3.73631 3.03668 3.62421 3.06915 3.54601 3.10899C3.35785 3.20487 3.20487 3.35785 3.10899 3.54601C3.06915 3.62421 3.03669 3.73631 3.01878 3.95552C3.00039 4.18056 3 4.47171 3 4.9V11.1C3 11.5283 3.00039 11.8194 3.01878 12.0445C3.03669 12.2637 3.06915 12.3758 3.10899 12.454C3.20487 12.6422 3.35785 12.7951 3.54601 12.891C3.62421 12.9309 3.73631 12.9633 3.95552 12.9812C4.18056 12.9996 4.47171 13 4.9 13H11.1C11.5283 13 11.8194 12.9996 12.0445 12.9812C12.2637 12.9633 12.3758 12.9309 12.454 12.891C12.6422 12.7951 12.7951 12.6422 12.891 12.454C12.9309 12.3758 12.9633 12.2637 12.9812 12.0445C12.9996 11.8194 13 11.5283 13 11.1V6.99998L14 5.99998V11.1V11.1207C14 11.5231 14 11.8553 13.9779 12.1259C13.9549 12.407 13.9057 12.6653 13.782 12.908C13.5903 13.2843 13.2843 13.5903 12.908 13.782C12.6653 13.9057 12.407 13.9549 12.1259 13.9779C11.8553 14 11.5231 14 11.1207 14H11.1H4.9H4.87934C4.47686 14 4.14468 14 3.87409 13.9779C3.59304 13.9549 3.33469 13.9057 3.09202 13.782C2.7157 13.5903 2.40973 13.2843 2.21799 12.908C2.09434 12.6653 2.04506 12.407 2.0221 12.1259C1.99999 11.8553 1.99999 11.5231 2 11.1207V11.1206V11.1V4.9V4.87935V4.87932V4.87931C1.99999 4.47685 1.99999 4.14468 2.0221 3.87409C2.04506 3.59304 2.09434 3.33469 2.21799 3.09202C2.40973 2.71569 2.7157 2.40973 3.09202 2.21799C3.33469 2.09434 3.59304 2.04506 3.87409 2.0221C4.14468 1.99999 4.47685 1.99999 4.87932 2H4.87935H4.9H9.99998Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
            </svg>
            <span className="hidden ml-2 md:flex">New Chat</span>
          </button>
        </div>
      </header>
      <main className="flex flex-col flex-1 bg-muted/50" style={{ marginTop: "60px" }}>
        <div className="relative flex h-[calc(100vh_-_theme(spacing.16)_-_2.5em_+_5px)] overflow-hidden">
          <div id="nav1" data-state="close" className="peer absolute inset-y-0 z-30 hidden -translate-x-full border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[250px] xl:w-[300px] h-full flex-col dark:bg-zinc-950" style={{ position: "fixed" }}>
            <div className="flex flex-col h-full" style={{ marginTop: "80px" }}>
              <div className="p-2 space-y-2">
                <Link className="inline-flex rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:text-accent-foreground py-2 h-10 w-full justify-start items-center bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10" href="/">
                  <svg width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 md:flex">New Chat</span>
                </Link>
                <Link target="_blank" className="inline-flex items-center rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:text-accent-foreground py-2 h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10" href="https://play.google.com/store/apps/details?id=com.NaradAI.NaradAIapp">
                  <svg data-testid="geist-icon" height={16} strokeLinejoin="round" viewBox="0 0 48 48" width={16}>
                    <path d="M 7.125 2 L 28.78125 23.5 L 34.71875 17.5625 L 8.46875 2.40625 C 8.03125 2.152344 7.5625 2.011719 7.125 2 Z M 5.3125 3 C 5.117188 3.347656 5 3.757813 5 4.21875 L 5 46 C 5 46.335938 5.070313 46.636719 5.1875 46.90625 L 27.34375 24.90625 Z M 36.53125 18.59375 L 30.1875 24.90625 L 36.53125 31.1875 L 44.28125 26.75 C 45.382813 26.113281 45.539063 25.304688 45.53125 24.875 C 45.519531 24.164063 45.070313 23.5 44.3125 23.09375 C 43.652344 22.738281 38.75 19.882813 36.53125 18.59375 Z M 28.78125 26.3125 L 6.9375 47.96875 C 7.300781 47.949219 7.695313 47.871094 8.0625 47.65625 C 8.917969 47.160156 26.21875 37.15625 26.21875 37.15625 L 34.75 32.25 Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 md:flex">Android App</span>
                </Link>
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-auto">
                  <div className="p-8 text-center">
                    <p className="text-sm text-muted-foreground" />
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
            <div className="pb-[110px] pt-4">
              {/* <div className="mx-auto max-w-2xl px-4">
                <div className="rounded-lg p-1">
                  <div className="flex justify-center items-center mt-8">
                    <span className="relative flex h-20 w-20 shrink-0 overflow-hidden rounded-full">
                      <Image className="aspect-square h-full w-full" height={100} width={100} alt="Image" src={"/favicon.ico"} />
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center mt-8">
                    <h1 className="mb-2 text-lg font-semibold">Welcome to New Gemini AI!</h1>
                    <p className="mb-2 leading-normal text-muted-foreground text-sm text-center">Hi there, I&apos;m an expert in python. How can I help?</p>
                  </div>
                </div>
              </div> */}
              <br />
              <br />
              <>
                {chats.map((item, index) => (
                  <div key={index}>
                    <div className="relative mx-auto max-w-2xl px-0" style={{ margin: "auto" }}>
                      {change}
                      <div className="group relative mb-4 flex items-start md:-ml-12">
                        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow message-role-icon bg-background">
                          {item.type === "user" ? <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                            fill="currentColor"
                            className="h-4 w-4"
                          >
                            <path d="M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56 56.06 56.06 0 0 1-56-56Z" />
                          </svg> : <Image alt="NaradAI" loading="lazy" width={30} height={20} decoding="async" className="invert-icon NaradAI-logo" src="/favicon.ico" style={{ color: 'transparent' }} />}

                        </div>
                        <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
                          <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 fix-max-with-100" style={{ marginTop: 5 }}>
                            <pre className="mb-2 last:mb-0" style={{margin:0,padding:0}}><p>{item.body}</p></pre>
                          </div>
                          <div className="flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0" />
                        </div>
                      </div>
                      <div
                        data-orientation="horizontal"
                        role="none"
                        className="shrink-0 bg-border h-[1px] w-full my-4 md:my-8" />
                    </div>
                  </div>
                ))}
              </>
            </div>

            <div className="fixed inset-x-0 bottom-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
              <div className="absolute h-44 bottom-0 pointer-events-none w-screen bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%" />
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium shadow ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 absolute right-4 bottom-full z-10 bg-background transition-opacity duration-300 sm:right-8 md:top-2 opacity-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4">
                  <path d="m205.66 149.66-72 72a8 8 0 0 1-11.32 0l-72-72a8 8 0 0 1 11.32-11.32L120 196.69V40a8 8 0 0 1 16 0v156.69l58.34-58.35a8 8 0 0 1 11.32 11.32Z" />
                </svg>
                <span className="sr-only">Scroll to bottom</span>
              </button>
              <div className="relative mx-auto sm:max-w-2xl sm:px-4">
                <div className="flex h-10 left-[50%] -translate-x-2/4 items-center justify-center absolute bottom-full">
                  <div className="flex gap-2" />
                </div>
                <div className="px-4 py-2 space-y-4 border-t shadow-lg bg-black sm:rounded-t-xl sm:border md:py-4" style={{ border: "solid black 1px" }}>
                  <form onSubmit={e => {
                    e.preventDefault()
                  }}>
                    <div className="absolute flex gap-2 bottom-[calc(100%+1rem)] hidden">
                      {/* <Image className="h-10" height={100} width={100} alt="Image" src={}/> */}
                      <div className="text-sm">
                        <button>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4">
                            <path d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
                          </svg>
                        </button>
                        <span />
                      </div>
                    </div>
                    <div role="presentation" tabIndex={0} className="fixed bg-background/50 backdrop-blur-sm top-0 left-0 w-screen flex h-screen items-center justify-center" style={{ display: 'none' }}>
                      <input tabIndex={-1} type="file" style={{ display: 'none' }} />
                    </div>
                    <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
                      <div className="absolute left-0 top-4  sm:left-4 flex gap-1">
                        <div className="inline-flex items-center justify-center text-sm font-medium shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-full bg-background p-0" data-state="closed">
                          <input className="hidden" id="file-input" accept="image/*" type="file" />
                          <label htmlFor="file-input" className="flex h-8 cursor-pointer items-center justify-center rounded-md transition-all">
                            <svg width={15} height={15} viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M3.5 2C3.22386 2 3 2.22386 3 2.5V12.5C3 12.7761 3.22386 13 3.5 13H11.5C11.7761 13 12 12.7761 12 12.5V4.70711L9.29289 2H3.5ZM2 2.5C2 1.67157 2.67157 1 3.5 1H9.5C9.63261 1 9.75979 1.05268 9.85355 1.14645L12.7803 4.07322C12.921 4.21388 13 4.40464 13 4.60355V12.5C13 13.3284 12.3284 14 11.5 14H3.5C2.67157 14 2 13.3284 2 12.5V2.5ZM4.75 7.5C4.75 7.22386 4.97386 7 5.25 7H7V5.25C7 4.97386 7.22386 4.75 7.5 4.75C7.77614 4.75 8 4.97386 8 5.25V7H9.75C10.0261 7 10.25 7.22386 10.25 7.5C10.25 7.77614 10.0261 8 9.75 8H8V9.75C8 10.0261 7.77614 10.25 7.5 10.25C7.22386 10.25 7 10.0261 7 9.75V8H5.25C4.97386 8 4.75 7.77614 4.75 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                            </svg>
                          </label>
                        </div>
                      </div>
                      <div className="pl-4 items-center gap-1 overflow-y-auto">
                        <textarea tabIndex={0} rows={1} placeholder="Enter a Prompt Here" spellCheck="false" id="chat-input-box" className="min-h-[60px] w-full resize-none bg-transparent pr-4 py-[1.3rem] focus-within:outline-none sm:text-sm" style={txtStyle} value={prompt} onChange={e => setPrompt(e.target.value)} onKeyUp={handleKeyPress} />
                      </div>
                      <div className="absolute right-0 top-4 sm:right-4">
                        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium shadow ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 w-8 p-0" id="send-button" type="button" data-state="closed" disabled={prompt === "" ? true : false} style={{ backgroundColor: "#18181b" }} onClick={send_msg}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4">
                            <path d="M200 32v144a8 8 0 0 1-8 8H67.31l34.35 34.34a8 8 0 0 1-11.32 11.32l-48-48a8 8 0 0 1 0-11.32l48-48a8 8 0 0 1 11.32 11.32L67.31 168H184V32a8 8 0 0 1 16 0Z" />
                          </svg>
                          <span className="sr-only">Send message</span>
                        </button>
                      </div>
                    </div>
                  </form>
                  <p className="px-2 text-center text-xs leading-normal text-muted-foreground hidden sm:block">By using Gemini AI you agree to the <Link href="#" target="_blank" className="inline-flex flex-1 justify-center gap-1 leading-4 hover:underline">
                    <span>Terms</span>
                    <svg aria-hidden="true" height={7} viewBox="0 0 6 6" width={7} className="opacity-70">
                      <path d="M1.25215 5.54731L0.622742 4.9179L3.78169 1.75597H1.3834L1.38936 0.890915H5.27615V4.78069H4.40513L4.41109 2.38538L1.25215 5.54731Z" fill="currentColor" />
                    </svg>
                  </Link> and <Link href="#" target="_blank" className="inline-flex flex-1 justify-center gap-1 leading-4 hover:underline">
                      <span>Privacy</span>
                      <svg aria-hidden="true" height={7} viewBox="0 0 6 6" width={7} className="opacity-70">
                        <path d="M1.25215 5.54731L0.622742 4.9179L3.78169 1.75597H1.3834L1.38936 0.890915H5.27615V4.78069H4.40513L4.41109 2.38538L1.25215 5.54731Z" fill="currentColor" />
                      </svg>
                    </Link>. </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main >
      <div role="dialog" id="nav2" aria-describedby="radix-:r2:" aria-labelledby="radix-:r1:" data-state="open" className="fixed left-0 z-50 border-r bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left data-[state=closed]:duration-300 data-[state=open]:duration-500 sm:max-w-sm inset-y-0 flex h-auto w-[300px] flex-col p-0" tabIndex={-1} style={{ pointerEvents: 'auto', display: "none" }}>
        <div data-state="open" className="flex h-full flex-col dark:bg-zinc-950">
          <div className="flex flex-col h-full">
            <div className="p-2 space-y-2">
              <Link className="inline-flex rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:text-accent-foreground py-2 h-10 w-full justify-start items-center bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10" href="/">
                <svg width={15} height={15} viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
                <span className="ml-2 md:flex">New Chat</span>
              </Link>

              <Link target="_blank" className="inline-flex items-center rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:text-accent-foreground py-2 h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10" href="https://play.google.com/store/apps/details?id=com.NaradAI.NaradAIapp">
                <svg data-testid="geist-icon" height={16} strokeLinejoin="round" viewBox="0 0 48 48" width={16}>
                  <path d="M 7.125 2 L 28.78125 23.5 L 34.71875 17.5625 L 8.46875 2.40625 C 8.03125 2.152344 7.5625 2.011719 7.125 2 Z M 5.3125 3 C 5.117188 3.347656 5 3.757813 5 4.21875 L 5 46 C 5 46.335938 5.070313 46.636719 5.1875 46.90625 L 27.34375 24.90625 Z M 36.53125 18.59375 L 30.1875 24.90625 L 36.53125 31.1875 L 44.28125 26.75 C 45.382813 26.113281 45.539063 25.304688 45.53125 24.875 C 45.519531 24.164063 45.070313 23.5 44.3125 23.09375 C 43.652344 22.738281 38.75 19.882813 36.53125 18.59375 Z M 28.78125 26.3125 L 6.9375 47.96875 C 7.300781 47.949219 7.695313 47.871094 8.0625 47.65625 C 8.917969 47.160156 26.21875 37.15625 26.21875 37.15625 L 34.75 32.25 Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
                <span className="ml-2 md:flex">Android App</span>
              </Link>
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-auto">
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4">
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-none hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4 transition-all">
                    <path d="M233.54 142.23a8 8 0 0 0-8-2 88.08 88.08 0 0 1-109.8-109.8 8 8 0 0 0-10-10 104.84 104.84 0 0 0-52.91 37A104 104 0 0 0 136 224a103.09 103.09 0 0 0 62.52-20.88 104.84 104.84 0 0 0 37-52.91 8 8 0 0 0-1.98-7.98Zm-44.64 48.11A88 88 0 0 1 65.66 67.11a89 89 0 0 1 31.4-26A106 106 0 0 0 96 56a104.11 104.11 0 0 0 104 104 106 106 0 0 0 14.92-1.06 89 89 0 0 1-26.02 31.4Z" />
                  </svg>
                  <span className="sr-only">Toggle theme</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <button type="button" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary" id="btn_nav3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" className="h-4 w-4">
            <path d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128 50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>    </div >
  );
}
