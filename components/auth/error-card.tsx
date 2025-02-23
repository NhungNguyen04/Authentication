import { FaExclamationTriangle } from "react-icons/fa";
import { Card, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./back-button";
import CardWrapper from "./card-wrapper";
import Header from "./header";

export default function ErrorCard () {
  return (
    <CardWrapper 
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex justify-center items-center">
        <FaExclamationTriangle className="text-destructive w-8 h-8"/>
      </div>
    </CardWrapper>
  )
}