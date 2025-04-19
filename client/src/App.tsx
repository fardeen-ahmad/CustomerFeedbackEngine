import { Switch, Route } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import FeedbackDetails from "@/pages/feedback-details";
import ChatDemo from "@/pages/chat-demo";
import NotFound from "@/pages/not-found";
import Navbar from "@/components/navigation/navbar";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/feedback/:id" component={FeedbackDetails} />
        <Route path="/chat-demo" component={ChatDemo} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Router />
    </TooltipProvider>
  );
}

export default App;
