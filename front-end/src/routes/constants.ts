import Hacker from "$lib/images/hacker.png";
import GrandpaJoe from "$lib/images/grandpa_joe.png";
import PowerUser from "$lib/images/power_user.png";
import MobileSarah from "$lib/images/mobile_sarah.png";
import SkepticalSam from "$lib/images/skeptical.gif";
import AccessibilityAnna from "$lib/images/disabled.png";

export const profiles = [
    {
      name: "The Hacker",
      description: "finds every vulnerability",
      icon: Hacker,
      color: "from-red-400 to-red-600",
      question: "what if I try to break this?"
    },
    {
      name: "Grandpa Joe",
      description: "represents confused users",
      icon: GrandpaJoe,
      color: "from-blue-400 to-blue-600",
      question: "how do I even use this?"
    },
    {
      name: "Power User",
      description: "pushes every limit",
      icon: PowerUser,
      color: "from-purple-400 to-purple-600",
      question: "can this handle my awesomeness?"
    },
    // {
    //   name: "Mobile Sarah",
    //   description: "tests on tiny screens",
    //   icon: MobileSarah,
    //   color: "from-green-400 to-green-600",
    //   question: "does this work on mobile?"
    // },
    // {
    //   name: "Skeptical Sam",
    //   description: "questions everything",
    //   icon: SkepticalSam,
    //   color: "from-yellow-400 to-yellow-600",
    //   question: "is this actually useful?"
    // },
    {
      name: "Accessibility Officer",
      description: "needs inclusive design",
      icon: AccessibilityAnna,
      color: "from-pink-400 to-pink-600",
      question: "can everyone use this?"
    }
  ];