import React, { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaTimes,
  FaRobot,
  FaUser,
  FaCalendarAlt,
  FaSpinner,
  FaMicrophone,
  FaMicrophoneSlash,
  FaCheck,
} from "react-icons/fa";
import axios from "axios";

const AppointmentChatbot = ({
  appointments = [],
  isAdmin = false,
  onAppointmentCreated = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text:
        "Hello! I'm your appointment assistant. You can ask me about your appointments or schedule a new one.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [chatContext, setChatContext] = useState({
    lastIntent: null,
    referredDate: null,
    referredAppointment: null,
    followUpMode: false,
  });

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Add state for appointment creation flow
  const [createAppointmentState, setCreateAppointmentState] = useState({
    isCreating: false,
    step: 0,
    date: null,
    time: null,
    name: "",
    email: "",
    phone: "",
    reason: "",
  });

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setVoiceSupported(true);
    } else {
      console.log("Speech recognition not supported in this browser");
    }
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!voiceSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = "en-US";

    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setInputText(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [voiceSupported]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const toggleListening = () => {
    if (!voiceSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      // Empty the input text when starting voice recognition
      setInputText("");
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() && !isListening) return;

    // Stop voice recording if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const userInput = inputText;
    setInputText("");

    // Simulate bot thinking
    setIsTyping(true);

    // Check if we're in appointment creation flow
    if (createAppointmentState.isCreating) {
      handleAppointmentCreationStep(userInput);
    } else {
      setTimeout(() => {
        // Process the message and generate response
        const { response, newContext } = processUserQuery(
          userInput,
          chatContext
        );

        // Update context based on this interaction
        setChatContext(newContext);

        const botMessage = {
          id: messages.length + 2,
          text: response,
          sender: "bot",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const processUserQuery = (query, context) => {
    const lowerQuery = query.toLowerCase().trim();
    const words = lowerQuery.split(/\s+/);

    // Initialize new context based on current context
    const newContext = { ...context };

    // Extract potential date references from the query
    const dateRef = extractDateReference(lowerQuery);
    if (dateRef) {
      newContext.referredDate = dateRef;
    }

    // Check for follow-up questions if we're in a specific context
    if (context.followUpMode) {
      const followUpResponse = handleFollowUp(lowerQuery, context);
      if (followUpResponse) {
        return {
          response: followUpResponse,
          newContext: {
            ...newContext,
            followUpMode: true, // Keep follow-up mode active
          },
        };
      }
    }

    // Define intent patterns
    const intents = [
      {
        name: "list_appointments",
        patterns: [
          "list",
          "show",
          "all",
          "my appointments",
          "get",
          "appointments",
          "what appointments",
          "do i have",
          "scheduled",
        ],
        handler: () => {
          newContext.lastIntent = "list_appointments";
          newContext.followUpMode = true;
          return generateAppointmentList(newContext.referredDate);
        },
      },
      {
        name: "next_appointment",
        patterns: [
          "next",
          "upcoming",
          "soon",
          "following",
          "closest",
          "nearest",
        ],
        handler: () => {
          newContext.lastIntent = "next_appointment";
          newContext.followUpMode = true;
          const nextApp = getNextAppointment();
          if (nextApp.includes("Your next appointment is")) {
            const appointmentInfo = parseAppointmentInfo(nextApp);
            if (appointmentInfo) {
              newContext.referredAppointment = appointmentInfo;
            }
          }
          return nextApp;
        },
      },
      {
        name: "today_appointments",
        patterns: ["today", "this day", "for today", "current day"],
        handler: () => {
          newContext.lastIntent = "today_appointments";
          newContext.followUpMode = true;
          return getTodayAppointments();
        },
      },
      {
        name: "tomorrow_appointments",
        patterns: ["tomorrow", "next day", "day after", "following day"],
        handler: () => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          newContext.lastIntent = "date_specific_appointments";
          newContext.referredDate = tomorrow;
          newContext.followUpMode = true;
          return getAppointmentsForDate(tomorrow);
        },
      },
      {
        name: "date_specific",
        patterns: [
          "on",
          "for",
          "at",
          "date",
          "specific",
          "particular",
          "scheduled for",
        ],
        handler: () => {
          if (newContext.referredDate) {
            newContext.lastIntent = "date_specific_appointments";
            newContext.followUpMode = true;
            return getAppointmentsForDate(newContext.referredDate);
          }
          return "Which date would you like to check? You can ask about specific dates like 'Show appointments for tomorrow' or 'Do I have any appointments next week?'";
        },
      },
      {
        name: "appointment_details",
        patterns: [
          "details",
          "more info",
          "tell me more",
          "information",
          "specifics",
          "about",
          "what time",
          "when",
        ],
        handler: () => {
          if (context.referredAppointment) {
            newContext.lastIntent = "appointment_details";
            return getAppointmentDetails(context.referredAppointment);
          }
          return "I'm not sure which appointment you're asking about. Could you specify?";
        },
      },
      {
        name: "greeting",
        patterns: ["hello", "hi", "hey", "greetings", "howdy", "what's up"],
        handler: () => {
          newContext.followUpMode = false;
          return getRandomResponse([
            "Hello! How can I help you with your appointments today?",
            "Hi there! Would you like to know about your appointments?",
            "Hey! I can help you check your appointments or schedule a new one.",
          ]);
        },
      },
      {
        name: "thanks",
        patterns: [
          "thanks",
          "thank you",
          "appreciate",
          "great",
          "awesome",
          "helpful",
        ],
        handler: () => {
          newContext.followUpMode = false;
          return getRandomResponse([
            "You're welcome! Is there anything else you'd like to know?",
            "Happy to help! Let me know if you need anything else.",
            "No problem! Feel free to ask if you have other questions.",
          ]);
        },
      },
      {
        name: "help",
        patterns: [
          "help",
          "how",
          "can you",
          "what can",
          "assist",
          "guide",
          "functions",
          "abilities",
        ],
        handler: () => {
          newContext.followUpMode = false;
          return 'I can help you with your appointments! Try asking questions like:\n\n• "Show my appointments"\n• "When is my next appointment?"\n• "Do I have any appointments today?"\n• "Show appointments for tomorrow"\n• "Tell me more about my next appointment"';
        },
      },
      {
        name: "create_appointment",
        patterns: [
          "create",
          "schedule",
          "book",
          "make",
          "new appointment",
          "set up",
          "arrange",
          "plan",
          "reserve",
        ],
        handler: () => {
          // Start the appointment creation flow
          setCreateAppointmentState({
            ...createAppointmentState,
            isCreating: true,
            step: 1,
          });

          return "I'd be happy to help you schedule a new appointment. What date would you like to book? (Please use format MM/DD/YYYY)";
        },
      },
    ];

    // Find matching intent by checking if any pattern words appear in the query
    for (const intent of intents) {
      const matchScore = intent.patterns.reduce((score, pattern) => {
        // Check for exact match of pattern phrase
        if (lowerQuery.includes(pattern)) {
          return score + pattern.split(" ").length * 2; // Weight multi-word matches higher
        }

        // Check for individual words
        const patternWords = pattern.split(" ");
        for (const word of patternWords) {
          if (words.includes(word) && word.length > 2) {
            // Avoid matching very short words
            score += 1;
          }
        }
        return score;
      }, 0);

      // If we have a significant match
      if (matchScore >= 2) {
        return { response: intent.handler(), newContext };
      }
    }

    // If we're in follow-up mode and didn't match any intent clearly,
    // try to use the context to determine what the user might be asking
    if (context.followUpMode) {
      if (
        words.some((w) =>
          ["yes", "yeah", "yep", "sure", "ok", "okay"].includes(w)
        )
      ) {
        if (context.lastIntent === "next_appointment") {
          return {
            response:
              "Would you like to see details of your next appointment, or would you prefer to see all your upcoming appointments?",
            newContext: { ...newContext, followUpMode: true },
          };
        }
      }

      if (words.some((w) => ["no", "nope", "not"].includes(w))) {
        return {
          response: "Is there something else I can help you with?",
          newContext: { ...newContext, followUpMode: false },
        };
      }
    }

    // Default response if no intent is matched
    return {
      response:
        "I'm not sure I understand. You can ask about your appointments, check your next appointment, or see today's schedule. Type 'help' to see what I can do.",
      newContext: { ...newContext, followUpMode: true },
    };
  };

  // Extract date references from user query
  const extractDateReference = (query) => {
    const today = new Date();

    // Check for "tomorrow"
    if (/\b(tomorrow|next day)\b/.test(query)) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }

    // Check for "next week"
    if (/\bnext week\b/.test(query)) {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek;
    }

    // Check for day of week (e.g., "on Monday")
    const dayMatch = query.match(
      /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i
    );
    if (dayMatch) {
      const dayOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ].indexOf(dayMatch[0].toLowerCase());

      if (dayOfWeek !== -1) {
        const targetDate = new Date(today);
        const currentDay = today.getDay();
        let daysToAdd = dayOfWeek - currentDay;
        if (daysToAdd <= 0) daysToAdd += 7; // Go to next week if day has passed

        targetDate.setDate(today.getDate() + daysToAdd);
        return targetDate;
      }
    }

    // Check for specific date format (MM/DD or Month Day)
    const dateMatch = query.match(/\b(\d{1,2})[\/\-](\d{1,2})\b/);
    if (dateMatch) {
      const month = parseInt(dateMatch[1]) - 1; // JS months are 0-indexed
      const day = parseInt(dateMatch[2]);
      const specificDate = new Date(today.getFullYear(), month, day);

      // If the date is in the past for this year, assume next year
      if (specificDate < today) {
        specificDate.setFullYear(today.getFullYear() + 1);
      }

      return specificDate;
    }

    // Check for month and day format (e.g., "January 10" or "Jan 10")
    const monthNames = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    for (const monthName of monthNames) {
      if (query.includes(monthName)) {
        const dayMatch = query.match(
          new RegExp(`\\b${monthName}\\s+(\\d{1,2})\\b`, "i")
        );
        if (dayMatch) {
          const day = parseInt(dayMatch[1]);
          let month = monthNames.indexOf(monthName.toLowerCase()) % 12;
          const specificDate = new Date(today.getFullYear(), month, day);

          // If the date is in the past for this year, assume next year
          if (specificDate < today) {
            specificDate.setFullYear(today.getFullYear() + 1);
          }

          return specificDate;
        }
      }
    }

    return null;
  };

  // Handle follow-up questions based on context
  const handleFollowUp = (query, context) => {
    const words = query.toLowerCase().split(/\s+/);

    // If asking about details of a previously mentioned appointment
    if (
      context.referredAppointment &&
      (query.includes("details") ||
        query.includes("tell me more") ||
        query.includes("what time"))
    ) {
      return getAppointmentDetails(context.referredAppointment);
    }

    // If confirming they want to see appointments after being asked
    if (
      words.some((w) =>
        ["yes", "yeah", "yep", "sure", "ok", "okay", "show", "list"].includes(w)
      )
    ) {
      if (context.lastIntent === "list_appointments") {
        return generateAppointmentList();
      }
      if (context.lastIntent === "next_appointment") {
        return getNextAppointment();
      }
      if (context.lastIntent === "today_appointments") {
        return getTodayAppointments();
      }
      if (
        context.lastIntent === "date_specific_appointments" &&
        context.referredDate
      ) {
        return getAppointmentsForDate(context.referredDate);
      }
    }

    return null;
  };

  // Parse appointment information from a response string for context tracking
  const parseAppointmentInfo = (responseText) => {
    // Example: "Your next appointment is on 5/20/2023 at 10:30 for Checkup."
    const dateMatch = responseText.match(
      /on\s+(\d{1,2}\/\d{1,2}\/\d{4}|\w+\s+\d{1,2},\s+\d{4})/
    );
    const timeMatch = responseText.match(/at\s+(\d{1,2}:\d{2})/);
    const reasonMatch = responseText.match(/for\s+(.+)\.$/);

    if (dateMatch) {
      return {
        date: dateMatch[1],
        time: timeMatch ? timeMatch[1] : null,
        reason: reasonMatch ? reasonMatch[1] : null,
      };
    }

    return null;
  };

  // Get appointments for a specific date
  const getAppointmentsForDate = (date) => {
    if (!appointments || appointments.length === 0) {
      return `You don't have any appointments scheduled for ${date.toLocaleDateString()}.`;
    }

    const dateString = date.toDateString();

    const dateAppointments = appointments
      .filter((apt) => apt.status !== "cancelled")
      .filter((apt) => {
        const appointmentDate = new Date(apt.date);
        return appointmentDate.toDateString() === dateString;
      })
      .sort((a, b) => {
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);

        if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
        return timeA[1] - timeB[1];
      });

    if (dateAppointments.length === 0) {
      return `You don't have any appointments scheduled for ${date.toLocaleDateString()}.`;
    }

    let response = `You have ${dateAppointments.length} appointment${
      dateAppointments.length > 1 ? "s" : ""
    } on ${date.toLocaleDateString()}:\n\n`;

    dateAppointments.forEach((apt, index) => {
      response += `${index + 1}. At ${apt.time}${
        apt.reason ? ` - ${apt.reason}` : ""
      }\n`;
      response += `   Status: ${apt.status || "pending"}\n\n`;
    });

    return response;
  };

  // Get detailed information about a specific appointment
  const getAppointmentDetails = (appointmentInfo) => {
    if (!appointmentInfo) {
      return "I don't have details about that appointment.";
    }

    // Find the actual appointment in our data
    let matchedAppointment = null;

    if (appointmentInfo.date) {
      // Try to find the appointment based on date/time
      const searchDate = new Date(appointmentInfo.date).toDateString();
      matchedAppointment = appointments.find((apt) => {
        const aptDate = new Date(apt.date).toDateString();
        return (
          aptDate === searchDate &&
          (!appointmentInfo.time || apt.time === appointmentInfo.time)
        );
      });
    }

    if (!matchedAppointment) {
      return "I couldn't find detailed information about that appointment.";
    }

    // Format detailed response
    let details = `Here are the details for your appointment:\n\n`;
    details += `📅 Date: ${new Date(
      matchedAppointment.date
    ).toLocaleDateString()}\n`;
    details += `⏰ Time: ${matchedAppointment.time}\n`;

    if (matchedAppointment.name) {
      details += `👤 With: ${matchedAppointment.name}\n`;
    }

    if (matchedAppointment.location) {
      details += `📍 Location: ${matchedAppointment.location}\n`;
    }

    if (matchedAppointment.reason) {
      details += `📝 Purpose: ${matchedAppointment.reason}\n`;
    }

    details += `📊 Status: ${matchedAppointment.status || "pending"}\n`;

    // Add extra information if the appointment is coming up soon
    const appointmentDate = new Date(matchedAppointment.date);
    appointmentDate.setHours(
      parseInt(matchedAppointment.time.split(":")[0]),
      parseInt(matchedAppointment.time.split(":")[1])
    );

    const now = new Date();
    const timeDiff = appointmentDate - now;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      details += `\nThis appointment is TODAY!`;
    } else if (daysDiff === 1) {
      details += `\nThis appointment is TOMORROW!`;
    } else if (daysDiff > 1 && daysDiff < 7) {
      details += `\nThis appointment is in ${daysDiff} days.`;
    }

    return details;
  };

  // Get random response for variation
  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateAppointmentList = (forDate = null) => {
    if (!appointments || appointments.length === 0) {
      return "You don't have any appointments scheduled.";
    }

    let filteredAppointments = [...appointments].filter(
      (apt) => apt.status !== "cancelled"
    );

    // If date is provided, filter appointments for that date
    if (forDate) {
      const dateString = forDate.toDateString();
      filteredAppointments = filteredAppointments.filter((apt) => {
        const appointmentDate = new Date(apt.date);
        return appointmentDate.toDateString() === dateString;
      });

      if (filteredAppointments.length === 0) {
        return `You don't have any appointments on ${forDate.toLocaleDateString()}.`;
      }

      let response = `You have ${filteredAppointments.length} appointment${
        filteredAppointments.length > 1 ? "s" : ""
      } on ${forDate.toLocaleDateString()}:\n\n`;

      filteredAppointments.sort((a, b) => {
        // Sort by time on the specific date
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);

        if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
        return timeA[1] - timeB[1];
      });

      filteredAppointments.forEach((apt, index) => {
        response += `${index + 1}. At ${apt.time}${
          apt.reason ? ` - ${apt.reason}` : ""
        }\n`;
        response += `   Status: ${apt.status || "pending"}\n\n`;
      });

      return response;
    }

    // Otherwise, show all upcoming appointments
    filteredAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (filteredAppointments.length === 0) {
      return "You don't have any active appointments.";
    }

    const now = new Date();
    const upcomingAppointments = filteredAppointments.filter((apt) => {
      const appointmentDate = new Date(apt.date);
      return appointmentDate >= now;
    });

    if (upcomingAppointments.length === 0) {
      return "You don't have any upcoming appointments. Would you like to see your past appointments?";
    }

    let response = `You have ${
      upcomingAppointments.length
    } upcoming appointment${upcomingAppointments.length > 1 ? "s" : ""}:\n\n`;

    upcomingAppointments.forEach((apt, index) => {
      const date = new Date(apt.date).toLocaleDateString();
      response += `${index + 1}. ${date} at ${apt.time}${
        apt.reason ? ` - ${apt.reason}` : ""
      }\n`;
      response += `   Status: ${apt.status || "pending"}\n\n`;
    });

    return response;
  };

  const getNextAppointment = () => {
    if (!appointments || appointments.length === 0) {
      return "You don't have any upcoming appointments.";
    }

    const now = new Date();
    const upcomingAppointments = appointments
      .filter((apt) => apt.status !== "cancelled")
      .filter((apt) => {
        const appointmentDate = new Date(apt.date);
        return appointmentDate >= now;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcomingAppointments.length === 0) {
      return "You don't have any upcoming appointments.";
    }

    const next = upcomingAppointments[0];
    const date = new Date(next.date).toLocaleDateString();
    const appointmentDate = new Date(next.date);

    // Calculate how soon the appointment is
    const timeDiff = appointmentDate - now;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    let timeframe = "";
    if (daysDiff === 0) {
      timeframe = " (Today)";
    } else if (daysDiff === 1) {
      timeframe = " (Tomorrow)";
    } else if (daysDiff < 7) {
      timeframe = ` (In ${daysDiff} days)`;
    }

    return `Your next appointment is on ${date}${timeframe} at ${next.time}${
      next.reason ? ` for ${next.reason}` : ""
    }.`;
  };

  const getTodayAppointments = () => {
    if (!appointments || appointments.length === 0) {
      return "You don't have any appointments scheduled for today.";
    }

    const today = new Date();
    const todayString = today.toDateString();

    const todayAppointments = appointments
      .filter((apt) => apt.status !== "cancelled")
      .filter((apt) => {
        const appointmentDate = new Date(apt.date);
        return appointmentDate.toDateString() === todayString;
      })
      .sort((a, b) => {
        // Sort by time
        const timeA = a.time.split(":").map(Number);
        const timeB = b.time.split(":").map(Number);

        if (timeA[0] !== timeB[0]) return timeA[0] - timeB[0];
        return timeA[1] - timeB[1];
      });

    if (todayAppointments.length === 0) {
      return "You don't have any appointments scheduled for today.";
    }

    let response = `You have ${todayAppointments.length} appointment${
      todayAppointments.length > 1 ? "s" : ""
    } today:\n\n`;

    todayAppointments.forEach((apt, index) => {
      response += `${index + 1}. At ${apt.time}${
        apt.reason ? ` - ${apt.reason}` : ""
      }\n`;
      response += `   Status: ${apt.status || "pending"}\n\n`;
    });

    return response;
  };

  const handleAppointmentCreationStep = (userInput) => {
    const currentStep = createAppointmentState.step;
    const newState = { ...createAppointmentState };
    let response = "";

    // Process each step and collect information
    switch (currentStep) {
      case 1: // Date
        try {
          // Attempt to parse the date
          const dateInput = userInput.trim();
          const dateRegex = /(\d{1,2})[\/\-](\d{1,2})[\/\-]?(\d{4})?/;
          const match = dateInput.match(dateRegex);

          let appointmentDate;
          if (match) {
            const month = parseInt(match[1]) - 1; // JS months are 0-indexed
            const day = parseInt(match[2]);
            const year = match[3]
              ? parseInt(match[3])
              : new Date().getFullYear();
            appointmentDate = new Date(year, month, day);
          } else {
            // Try natural language processing for dates
            appointmentDate = extractDateReference(dateInput);
          }

          if (appointmentDate && !isNaN(appointmentDate)) {
            newState.date = appointmentDate;
            newState.step = 2;
            response = `Great! You selected ${appointmentDate.toLocaleDateString()}. What time would you prefer? (Please use format HH:MM AM/PM)`;
          } else {
            response =
              "I couldn't understand that date format. Please use MM/DD/YYYY or try a phrase like 'tomorrow' or 'next Monday'.";
          }
        } catch (error) {
          response =
            "I couldn't understand that date. Please use MM/DD/YYYY format.";
        }
        break;

      case 2: // Time
        try {
          const timeInput = userInput.trim().toLowerCase();
          // Match 12-hour format (e.g., "2:30 pm", "10am")
          const timeRegex12 = /(\d{1,2})(?::(\d{2}))?(?:\s*)?(am|pm)?/i;
          // Match 24-hour format (e.g., "14:30", "10:00")
          const timeRegex24 = /(\d{1,2}):(\d{2})/;

          let hours, minutes;

          // Try to match 12-hour format first
          const match12 = timeInput.match(timeRegex12);
          if (match12) {
            hours = parseInt(match12[1]);
            minutes = match12[2] ? parseInt(match12[2]) : 0;

            // Adjust for AM/PM
            const isPM = match12[3] && match12[3].toLowerCase() === "pm";
            if (isPM && hours < 12) hours += 12;
            if (!isPM && hours === 12) hours = 0;
          }
          // Try 24-hour format
          else {
            const match24 = timeInput.match(timeRegex24);
            if (match24) {
              hours = parseInt(match24[1]);
              minutes = parseInt(match24[2]);
            } else {
              throw new Error("Invalid time format");
            }
          }

          // Validate hours and minutes
          if (
            !isNaN(hours) &&
            !isNaN(minutes) &&
            hours >= 0 &&
            hours < 24 &&
            minutes >= 0 &&
            minutes < 60
          ) {
            // Format time properly for storage
            const formattedTime = `${hours
              .toString()
              .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
            newState.time = formattedTime;
            newState.step = 3;
            response = "Perfect! Now, could you provide your name?";
          } else {
            response =
              "I couldn't understand that time format. Please try again with HH:MM AM/PM.";
          }
        } catch (error) {
          response =
            "I couldn't understand that time format. Please try again with something like '2:30 PM' or '14:30'.";
        }
        break;

      case 3: // Name
        if (userInput.trim().length > 0) {
          newState.name = userInput.trim();
          newState.step = 4;
          response = "Got it! Now, please provide your email address.";
        } else {
          response = "I need your name to proceed. Please tell me your name.";
        }
        break;

      case 4: // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(userInput.trim())) {
          newState.email = userInput.trim();
          newState.step = 5;
          response = "Thanks! Please provide your phone number.";
        } else {
          response =
            "That doesn't look like a valid email address. Please try again.";
        }
        break;

      case 5: // Phone
        const phoneInput = userInput.trim().replace(/[^0-9]/g, "");
        if (phoneInput.length >= 10) {
          newState.phone = phoneInput;
          newState.step = 6;
          response = "Great! Finally, what's the reason for your appointment?";
        } else {
          response =
            "I need a valid phone number (at least 10 digits). Please try again.";
        }
        break;

      case 6: // Reason
        if (userInput.trim().length > 0) {
          newState.reason = userInput.trim();
          newState.step = 7;

          // Show appointment summary
          const appointmentDate = newState.date.toLocaleDateString();
          response = `Here's your appointment summary:
          
Date: ${appointmentDate}
Time: ${newState.time}
Name: ${newState.name}
Email: ${newState.email}
Phone: ${newState.phone}
Reason: ${newState.reason}

Would you like to confirm this appointment? (Yes/No)`;
        } else {
          response = "Please provide a reason for your appointment.";
        }
        break;

      case 7: // Confirmation
        if (/^(yes|yeah|yep|confirm|book it|sure|y)$/i.test(userInput.trim())) {
          // Submit the appointment
          createAppointment(newState);
          response = "I'm submitting your appointment request...";
        } else {
          // Cancel the appointment creation
          setCreateAppointmentState({
            isCreating: false,
            step: 0,
            date: null,
            time: null,
            name: "",
            email: "",
            phone: "",
            reason: "",
          });
          response =
            "I've cancelled the appointment creation. Let me know if you'd like to try again.";
        }
        break;

      default:
        setCreateAppointmentState({
          isCreating: false,
          step: 0,
          date: null,
          time: null,
          name: "",
          email: "",
          phone: "",
          reason: "",
        });
        response =
          "Something went wrong. Let's start over. How can I help you?";
    }

    // Update the state
    setCreateAppointmentState(newState);

    // Add bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  // Function to create the appointment
  const createAppointment = async (appointmentData) => {
    try {
      // Format the date correctly for the API
      const formattedDate = appointmentData.date.toISOString().split("T")[0];

      const appointmentPayload = {
        name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone,
        date: formattedDate,
        time: appointmentData.time,
        reason: appointmentData.reason,
        status: "pending",
      };

      setIsTyping(true);

      // Make the API request
      const response = await axios.post(
        "http://localhost:5555/appointments",
        appointmentPayload
      );

      // Reset the appointment creation state
      setCreateAppointmentState({
        isCreating: false,
        step: 0,
        date: null,
        time: null,
        name: "",
        email: "",
        phone: "",
        reason: "",
      });

      // Send a success message
      const successMessage = {
        id: messages.length + 3,
        text: `Success! Your appointment has been scheduled for ${new Date(
          formattedDate
        ).toLocaleDateString()} at ${
          appointmentData.time
        }. Your appointment ID is ${
          response.data._id
        }. You'll receive a confirmation soon.`,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, successMessage]);

      // Notify parent component (optional)
      onAppointmentCreated(response.data);
    } catch (error) {
      console.error("Error creating appointment:", error);

      // Send an error message
      const errorMessage = {
        id: messages.length + 3,
        text:
          "I'm sorry, there was an error scheduling your appointment. Please try again or contact support for assistance.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);

      // Reset the creation state
      setCreateAppointmentState({
        isCreating: false,
        step: 0,
        date: null,
        time: null,
        name: "",
        email: "",
        phone: "",
        reason: "",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 rounded-full bg-scolor text-white p-4 shadow-lg hover:bg-pcolor transition-colors z-40"
        aria-label="Toggle chat"
      >
        {isOpen ? <FaTimes size={20} /> : <FaRobot size={20} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 md:w-96 bg-white rounded-lg shadow-xl z-40 flex flex-col max-h-[70vh] border border-gray-200">
          {/* Chat header */}
          <div className="bg-scolor text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <FaRobot className="mr-2" />
              <h3 className="font-medium">Appointment Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <FaTimes />
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "text-right" : ""
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-scolor text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {message.sender === "bot" ? (
                      <FaRobot className="text-scolor mr-1" size={14} />
                    ) : (
                      <FaUser className="text-white mr-1" size={14} />
                    )}
                    <span className="text-xs opacity-75">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="mb-4">
                <div className="inline-block p-3 rounded-lg bg-white text-gray-800 rounded-bl-none border border-gray-200">
                  <div className="flex items-center">
                    <FaSpinner className="text-scolor mr-2 animate-spin" />
                    <span>Typing...</span>
                  </div>
                </div>
              </div>
            )}
            {isListening && (
              <div className="mb-4">
                <div className="inline-block p-3 rounded-lg bg-white text-gray-800 rounded-bl-none border border-red-200 animate-pulse">
                  <div className="flex items-center">
                    <FaMicrophone className="text-red-500 mr-2 animate-pulse" />
                    <span>Listening...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 p-4"
          >
            <div className="flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder={
                  isListening
                    ? "Listening..."
                    : createAppointmentState.isCreating
                    ? getPlaceholderForStep(createAppointmentState.step)
                    : "Ask about your appointments..."
                }
                className={`flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 ${
                  isListening
                    ? "border-red-300 focus:ring-red-500 text-red-700 bg-red-50"
                    : createAppointmentState.isCreating
                    ? "border-green-300 focus:ring-green-500"
                    : "border-gray-300 focus:ring-scolor"
                }`}
              />
              {voiceSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 text-white ${
                    isListening
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  } transition-colors`}
                  aria-label={
                    isListening ? "Stop listening" : "Start voice input"
                  }
                >
                  {isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                </button>
              )}
              <button
                type="submit"
                className="bg-scolor text-white p-2 rounded-r-lg hover:bg-pcolor transition-colors"
                disabled={isTyping || (!inputText.trim() && !isListening)}
              >
                <FaPaperPlane />
              </button>
            </div>

            {/* Show a progress indicator for appointment creation */}
            {createAppointmentState.isCreating && (
              <div className="flex justify-between items-center mt-2 px-1">
                <div className="flex space-x-1">
                  {Array.from({ length: 7 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 w-7 rounded-full ${
                        idx < createAppointmentState.step
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    ></div>
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Step {createAppointmentState.step} of 7
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

// Helper function to get placeholder text based on the current appointment creation step
function getPlaceholderForStep(step) {
  switch (step) {
    case 1:
      return "Enter appointment date (MM/DD/YYYY)...";
    case 2:
      return "Enter appointment time (HH:MM AM/PM)...";
    case 3:
      return "Enter your name...";
    case 4:
      return "Enter your email address...";
    case 5:
      return "Enter your phone number...";
    case 6:
      return "Enter reason for appointment...";
    case 7:
      return "Type 'yes' to confirm or 'no' to cancel...";
    default:
      return "Ask about your appointments...";
  }
}

export default AppointmentChatbot;
