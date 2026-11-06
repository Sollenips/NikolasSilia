import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type Lang = 'en' | 'el';

type Dict = Record<string, { en: string; el: string }>;

const dict: Dict = {
  // Header
  'nav.browse': { en: 'Browse Classes', el: 'Περιήγηση Μαθημάτων' },
  'nav.howItWorks': { en: 'How It Works', el: 'Πώς Λειτουργεί' },
  'nav.areas': { en: 'Areas', el: 'Περιοχές' },
  'nav.book': { en: 'Book', el: 'Κράτηση' },
  'nav.yourClass': { en: '@Class', el: '@Class' },
  'nav.accessibility': { en: 'Accessibility', el: 'Προσβασιμότητα' },
  'nav.colorblindMode': { en: 'Colorblind mode', el: 'Λειτουργία χρωματισμού' },

  // Hero
  'hero.badge': { en: 'Now serving {count} areas across Athens', el: 'Τώρα σε {count} περιοχές της Αθήνας' },
  'hero.showAllAreas': { en: 'Show all {count} areas', el: 'Εμφάνιση και των {count} περιοχών' },
  'hero.showFewerAreas': { en: 'Show fewer', el: 'Λιγότερες' },
  'hero.title1': { en: 'Book a class', el: 'Κλείσε ένα μάθημα' },
  'hero.title2': { en: 'near you in Athens', el: 'κοντά σου στην Αθήνα' },
  'hero.desc': {
    en: 'Karate, music, dance, art, yoga, swimming and more. Browse trusted local studios, pick a time that works, and book your spot online — no phone calls, no visits, no hassle.',
    el: 'Καράτε, μουσική, χορός, ζωγραφική, γιόγκα, κολύμβηση και άλλα. Ψάξε τοπικά στούντιο, επίλεξε ώρα που σου βολεύει και κλείσε τη θέση σου online — χωρίς τηλεφωνήματα, χωρίς επισκέψεις, χωρίς ταλαιπωρία.',
  },
  'hero.searchPlaceholder': {
    en: 'Search by class, activity, or studio name...',
    el: 'Αναζήτηση ανά μάθημα, δραστηριότητα ή στούντιο...',
  },
  'hero.areas': { en: 'Areas:', el: 'Περιοχές:' },
  'hero.age': { en: 'Age', el: 'Ηλικία' },
  'hero.location': { en: 'Location', el: 'Τοποθεσία' },
  'hero.interest': { en: 'Interest', el: 'Ενδιαφέρον' },

  // Filters
  'filter.active': { en: 'active', el: 'ενεργά' },
  'filter.clear': { en: 'Clear', el: 'Καθαρισμός' },
  'filter.allAreas': { en: 'All areas', el: 'Όλες οι περιοχές' },
  'filter.allCategories': { en: 'All categories', el: 'Όλες οι κατηγορίες' },
  'filter.allAges': { en: 'All ages', el: 'Όλες τις ηλικίες' },
  'filter.age.4-6': { en: '4–6 years', el: '4–6 ετών' },
  'filter.age.7-9': { en: '7–9 years', el: '7–9 ετών' },
  'filter.age.10-12': { en: '10–12 years', el: '10–12 ετών' },
  'filter.age.13-17': { en: '13–17 years', el: '13–17 ετών' },
  'filter.age.18plus': { en: '18+ years', el: '18+ ετών' },

  // Browse results
  'browse.loading': { en: 'Loading classes...', el: 'Φόρτωση μαθημάτων...' },
  'browse.noResults': { en: 'No classes found', el: 'Δεν βρέθηκαν μαθήματα' },
  'browse.tryAdjusting': { en: 'Try adjusting your filters or search term.', el: 'Δοκίμασε να αλλάξεις τα φίλτρα ή την αναζήτηση.' },
  'browse.clearAll': { en: 'Clear all filters', el: 'Καθαρισμός φίλτρων' },
  'browse.classAvailable': { en: 'class available', el: 'μάθημα διαθέσιμο' },
  'browse.classesAvailable': { en: 'classes available', el: 'μαθήματα διαθέσιμα' },
  'browse.viewList': { en: 'List', el: 'Λίστα' },
  'browse.viewMap': { en: 'Map', el: 'Χάρτης' },
  'browse.mapHint': { en: 'Click a marker to see classes at that studio', el: 'Κάνε κλικ σε έναν δείκτη για να δεις τα μαθήματα στο στούντιο' },

  // Class card
  'card.view': { en: 'View', el: 'Προβολή' },
  'card.perSession': { en: '/session', el: '/μάθημα' },
  'card.yrs': { en: 'yrs', el: 'ετών' },
  'card.yrsPlus': { en: '+ yrs', el: '+ ετών' },
  'card.min': { en: 'min', el: 'λεπτά' },

  // Class detail
  'detail.back': { en: 'Back to all classes', el: 'Πίσω σε όλα τα μαθήματα' },
  'detail.instructor': { en: 'Instructor', el: 'Δάσκαλος' },
  'detail.ageRange': { en: 'Age range', el: 'Ηλικία' },
  'detail.duration': { en: 'Duration', el: 'Διάρκεια' },
  'detail.minutes': { en: 'minutes', el: 'λεπτά' },
  'detail.classSize': { en: 'Class size', el: 'Μέγεθος τάξης' },
  'detail.upTo': { en: 'Up to', el: 'Έως' },
  'detail.schedule': { en: 'Schedule', el: 'Πρόγραμμα' },
  'detail.price': { en: 'Price', el: 'Τιμή' },
  'detail.perSession': { en: '/ session', el: '/ μάθημα' },
  'detail.aboutStudio': { en: 'About the studio', el: 'Σχετικά με το στούντιο' },
  'detail.perSessionSidebar': { en: 'per session', el: ' ανά μάθημα' },
  'detail.bookClass': { en: 'Book this class', el: 'Κλείσε αυτό το μάθημα' },
  'detail.noPayment': {
    en: 'No payment needed now — the studio will confirm your spot.',
    el: 'Δεν απαιτείται πληρωμή τώρα — το στούντιο θα επιβεβαιώσει τη θέση σου.',
  },
  'detail.years': { en: 'years', el: 'ετών' },
  'detail.yearsPlus': { en: '+ years', el: '+ ετών' },

  // Studio detail extras
  'detail.studioPhotos': { en: 'Studio photos', el: 'Φωτογραφίες στούντιο' },
  'detail.studioDetails': { en: 'Studio details', el: 'Λεπτομέρειες στούντιο' },
  'detail.floor': { en: 'Floor', el: 'Όροφος' },
  'detail.disabilityAccess': { en: 'Disability access', el: 'Προσβασιμότητα' },
  'detail.accessible': { en: 'Wheelchair accessible', el: 'Προσβάσιμο για ΑΜΕΑ' },
  'detail.notAccessible': { en: 'Not wheelchair accessible', el: 'Μη προσβάσιμο για ΑΜΕΑ' },
  'detail.rates': { en: 'Rates', el: 'Τιμές' },
  'detail.studioSchedule': { en: 'Weekly schedule', el: 'Εβδομαδιαίο πρόγραμμα' },
  'detail.firstClassDiscount': { en: '1st class {pct}% off', el: '1ο μάθημα {pct}% έκπτωση' },

  // Booking form
  'booking.back': { en: 'Back to class details', el: 'Πίσω στις λεπτομέρειες' },
  'booking.bookTitle': { en: 'Book:', el: 'Κράτηση:' },
  'booking.participant': { en: 'Participant', el: 'Συμμετέχων' },
  'booking.participantName': { en: 'Participant name', el: 'Όνομα συμμετέχοντα' },
  'booking.participantAge': { en: 'Participant age', el: 'Ηλικία συμμετέχοντα' },
  'booking.participantNamePh': { en: 'e.g. Alex Papadopoulos', el: 'π.χ. Αλέξης Παπαδόπουλος' },
  'booking.participantAgePh': { en: 'e.g. 8', el: 'π.χ. 8' },
  'booking.minorWarning': {
    en: 'This participant is under 18. A parent or guardian must complete this booking.',
    el: 'Ο συμμετέχων είναι κάτω των 18. Ένας γονέας ή κηδεμόνας πρέπει να συμπληρώσει την κράτηση.',
  },
  'booking.guardianName': { en: 'Parent / guardian name', el: 'Όνομα γονέα / κηδεμόνα' },
  'booking.guardianNamePh': { en: 'e.g. Maria Papadopoulos', el: 'π.χ. Μαρία Παπαδοπούλου' },
  'booking.contactDetails': { en: 'Contact details', el: 'Στοιχεία επικοινωνίας' },
  'booking.yourName': { en: 'Your name', el: 'Το όνομά σου' },
  'booking.yourNamePh': { en: 'Your full name', el: 'Το πλήρες όνομά σου' },
  'booking.email': { en: 'Email', el: 'Email' },
  'booking.emailPh': { en: 'you@example.com', el: 'you@example.com' },
  'booking.phone': { en: 'Phone', el: 'Τηλέφωνο' },
  'booking.phonePh': { en: '+30 690 000 0000', el: '+30 690 000 0000' },
  'booking.preferredDate': { en: 'Preferred date', el: 'Προτιμώμενη ημερομηνία' },
  'booking.whenStart': { en: 'When would you like to start?', el: 'Πότε θέλεις να ξεκινήσεις;' },
  'booking.scheduleHint': { en: 'The studio will confirm exact availability. Schedule:', el: 'Το στούντιο θα επιβεβαιώσει την ακριβή διαθεσιμότητα. Πρόγραμμα:' },
  'booking.notes': { en: 'Notes (optional)', el: 'Σχόλια (προαιρετικά)' },
  'booking.notesPh': { en: 'Any questions or special requests for the studio?', el: 'Ερωτήσεις ή ειδικά αιτήματα για το στούντιο;' },
  'booking.submitting': { en: 'Submitting...', el: 'Υποβολή...' },
  'booking.submit': { en: 'Submit booking', el: 'Υποβολή κράτησης' },
  'booking.secure': { en: 'Your details are sent securely to the studio.', el: 'Τα στοιχεία σου στέλνονται με ασφάλεια στο στούντιο.' },
  'booking.errorAge': { en: 'Please enter a valid age.', el: 'Παρακαλώ εισάγετε έγκυρη ηλικία.' },
  'booking.errorMinAge': { en: 'This class requires a minimum age of', el: 'Αυτό το μάθημα απαιτεί ελάχιστη ηλικία' },
  'booking.errorMaxAge': { en: 'This class is for ages up to', el: 'Αυτό το μάθημα είναι για ηλικίες έως' },
  'booking.errorGuardian': { en: 'A parent or guardian name is required for participants under 18.', el: 'Απαιτείται όνομα γονέα ή κηδεμόνα για συμμετέχοντες κάτω των 18.' },
  'booking.errorDate': { en: 'Please select a preferred date.', el: 'Παρακαλώ επιλέξτε προτιμώμενη ημερομηνία.' },
  'booking.errorEmail': { en: 'Please enter a valid email address.', el: 'Παρακαλώ εισάγετε έγκυρο email.' },
  'booking.errorGeneric': { en: 'Something went wrong. Please try again.', el: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.' },

  // Booking success
  'success.title': { en: 'Booking request sent!', el: 'Το αίτημα κράτησης στάλθηκε!' },
  'success.desc': {
    en: "We've sent your request for",
    el: 'Στείλαμε το αίτημά σου για',
  },
  'success.toStudio': {
    en: "to the studio. They'll contact you shortly to confirm your spot and arrange payment.",
    el: 'στο στούντιο. Θα επικοινωνήσουν μαζί σου σύντομα για να επιβεβαιώσουν τη θέση και να κανονίσουν την πληρωμή.',
  },
  'success.nextSteps': { en: 'What happens next?', el: 'Τι ακολουθεί;' },
  'success.step1': { en: 'The studio reviews your request and confirms availability.', el: 'Το στούντιο ελέγχει το αίτημά σου και επιβεβαιώνει τη διαθεσιμότητα.' },
  'success.step2': { en: "You'll receive a confirmation by email or phone.", el: 'Θα λάβεις επιβεβαίωση μέσω email ή τηλεφώνου.' },
  'success.step3': { en: 'Payment is arranged directly with the studio.', el: 'Η πληρωμή κανονίζεται απευθείας με το στούντιο.' },
  'success.back': { en: 'Back to browsing', el: 'Πίσω στην περιήγηση' },

  // Footer
  'footer.desc': { en: 'Discover and book classes from trusted local studios across Athens.', el: 'Ανακάλυψε και κλείσε μαθήματα από αξιόπιστα τοπικά στούντιο σε όλη την Αθήνα.' },
  'footer.areasCover': { en: 'Areas we cover', el: 'Περιοχές που καλύπτουμε' },
  'how.title': { en: 'How it works', el: 'Πώς λειτουργεί' },
  'how.subtitle': { en: 'Book a class in four simple steps', el: 'Κλείσε ένα μάθημα σε τέσσερα απλά βήματα' },
  'how.s1.title': { en: 'Choose your area', el: 'Διάλεξε περιοχή' },
  'how.s1.desc': { en: 'Pick the area, age group and interest that fit your child, or search by class name.', el: 'Επίλεξε την περιοχή, την ηλικιακή ομάδα και το ενδιαφέρον που ταιριάζουν στο παιδί σου, ή ψάξε με το όνομα του μαθήματος.' },
  'how.s2.title': { en: 'Compare classes', el: 'Σύγκρινε τα μαθήματα' },
  'how.s2.desc': { en: 'See schedules, prices, the studio and its teachers before you decide.', el: 'Δες προγράμματα, τιμές, το στούντιο και τους εκπαιδευτές πριν αποφασίσεις.' },
  'how.s3.title': { en: 'Book your spot', el: 'Κλείσε τη θέση σου' },
  'how.s3.desc': { en: 'Fill in the short booking form for your child or for yourself.', el: 'Συμπλήρωσε τη σύντομη φόρμα κράτησης για το παιδί σου ή για σένα.' },
  'how.s4.title': { en: 'Get confirmed', el: 'Επιβεβαίωση' },
  'how.s4.desc': { en: 'The studio confirms your spot directly with you.', el: 'Το στούντιο επιβεβαιώνει τη θέση σου απευθείας μαζί σου.' },
  'footer.madeFor': { en: 'Book@Class © 2026 — Made for Athens.', el: 'Book@Class © 2026 — Φτιαγμένο για την Αθήνα.' },
  'footer.copyright': { en: '© 2026 Book@Class. All rights reserved.', el: '© 2026 Book@Class. Με επιφύλαξη παντός δικαιώματος.' },

  // Categories
  'cat.Martial Arts': { en: 'Martial Arts', el: 'Πολεμικές Τέχνες' },
  'cat.Music': { en: 'Music', el: 'Μουσική' },
  'cat.Dance': { en: 'Dance', el: 'Χορός' },
  'cat.Art': { en: 'Art', el: 'Ζωγραφική' },
  'cat.Yoga': { en: 'Yoga', el: 'Γιόγκα' },
  'cat.Swimming': { en: 'Swimming', el: 'Κολύμβηση' },
  'cat.Languages': { en: 'Languages', el: 'Γλώσσες' },
  'cat.Tennis': { en: 'Tennis', el: 'Τένις' },
  'cat.Basketball': { en: 'Basketball', el: 'Μπάσκετ' },
  'cat.Gym': { en: 'Gym', el: 'Γυμναστήριο' },
  'cat.Theater': { en: 'Theater', el: 'Θέατρο' },
  'cat.Football': { en: 'Football', el: 'Ποδόσφαιρο' },

  // Areas
  'area.Agia Paraskevi': { en: 'Agia Paraskevi', el: 'Αγία Παρασκευή' },
  'area.Ambelokipi': { en: 'Ambelokipi', el: 'Αμπελόκηποι' },
  'area.Chalandri': { en: 'Chalandri', el: 'Χαλάνδρι' },
  'area.Egaleo': { en: 'Egaleo', el: 'Αιγάλεω' },
  'area.Exarchia': { en: 'Exarchia', el: 'Εξάρχεια' },
  'area.Gazi': { en: 'Gazi', el: 'Γκάζι' },
  'area.Glyfada': { en: 'Glyfada', el: 'Γλυφάδα' },
  'area.Goudi': { en: 'Goudi', el: 'Γούδη' },
  'area.Holargos': { en: 'Holargos', el: 'Χολαργός' },
  'area.Ilioupoli': { en: 'Ilioupoli', el: 'Ηλιούπολη' },
  'area.Kaisariani': { en: 'Kaisariani', el: 'Καισαριανή' },
  'area.Kallithea': { en: 'Kallithea', el: 'Καλλιθέα' },
  'area.Kifisia': { en: 'Kifisia', el: 'Κηφισιά' },
  'area.Kolonaki': { en: 'Kolonaki', el: 'Κολωνάκι' },
  'area.Kolonos': { en: 'Kolonos', el: 'Κολωνός' },
  'area.Koukaki': { en: 'Koukaki', el: 'Κουκάκι' },
  'area.Kypseli': { en: 'Kypseli', el: 'Κυψέλη' },
  'area.Marousi': { en: 'Marousi', el: 'Μαρούσι' },
  'area.Mets': { en: 'Mets', el: 'Μετς' },
  'area.Monastiraki': { en: 'Monastiraki', el: 'Μοναστηράκι' },
  'area.Moschato': { en: 'Moschato', el: 'Μοσχάτο' },
  'area.Nea Smyrni': { en: 'Nea Smyrni', el: 'Νέα Σμύρνη' },
  'area.Neos Kosmos': { en: 'Neos Kosmos', el: 'Νέος Κόσμος' },
  'area.Pagkrati': { en: 'Pagkrati', el: 'Παγκράτι' },
  'area.Palaio Faliro': { en: 'Palaio Faliro', el: 'Παλαιό Φάληρο' },
  'area.Patisia': { en: 'Patisia', el: 'Πατήσια' },
  'area.Peristeri': { en: 'Peristeri', el: 'Περιστέρι' },
  'area.Petralona': { en: 'Petralona', el: 'Πετράλωνα' },
  'area.Plaka': { en: 'Plaka', el: 'Πλάκα' },
  'area.Psirri': { en: 'Psirri', el: 'Ψυρρή' },
  'area.Thiseio': { en: 'Thiseio', el: 'Θησείο' },
  'area.Vironas': { en: 'Vironas', el: 'Βύρωνας' },
  'area.Voula': { en: 'Voula', el: 'Βούλα' },
  'area.Vouliagmeni': { en: 'Vouliagmeni', el: 'Βουλιαγμένη' },
  'area.Zografou': { en: 'Zografou', el: 'Ζωγράφου' },

  // Auth
  'auth.signIn': { en: 'Sign In', el: 'Σύνδεση' },
  'auth.signOut': { en: 'Sign Out', el: 'Αποσύνδεση' },
  'auth.signUp': { en: 'Sign Up', el: 'Εγγραφή' },
  'auth.admin': { en: 'Admin', el: 'Διαχειριστής' },
  'auth.email': { en: 'Email', el: 'Email' },
  'auth.password': { en: 'Password', el: 'Κωδικός' },
  'auth.confirmPassword': { en: 'Confirm password', el: 'Επιβεβαίωση κωδικού' },
  'auth.signInTitle': { en: 'Sign in to manage your classes', el: 'Συνδέσου για να διαχειριστείς τα μαθήματά σου' },
  'auth.signUpTitle': { en: 'Create your studio account', el: 'Δημιουργία λογαριασμού στούντιο' },
  'auth.noAccount': { en: "Don't have an account?", el: 'Δεν έχεις λογαριασμό;' },
  'auth.haveAccount': { en: 'Already have an account? Sign in', el: 'Έχετε ήδη λογαριασμό; Συνδεθείτε' },
  'auth.signInBtn': { en: 'Sign In', el: 'Σύνδεση' },
  'auth.signUpBtn': { en: 'Sign Up', el: 'Εγγραφή' },
  'auth.errorInvalid': { en: 'Invalid email or password.', el: 'Λάθος email ή κωδικός.' },
  'auth.errorExists': { en: 'An account with this email already exists.', el: 'Υπάρχει ήδη λογαριασμός με αυτό το email.' },
  'auth.errorGeneric': { en: 'Something went wrong. Please try again.', el: 'Κάτι πήγε στραβά. Παρακαλώ δοκιμάστε ξανά.' },
  'auth.errorShort': { en: 'Password must be at least 6 characters.', el: 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.' },
  'auth.errorMismatch': { en: 'Passwords do not match.', el: 'Οι κωδικοί δεν ταιριάζουν.' },

  // Admin dashboard
  'admin.title': { en: 'Admin Dashboard', el: 'Πίνακας Διαχειριστή' },
  'admin.subtitle': { en: 'Manage your classes and view bookings', el: 'Διαχειρίσου τα μαθήματά σου και δες τις κρατήσεις' },
  'admin.classes': { en: 'Classes', el: 'Μαθήματα' },
  'admin.bookings': { en: 'Bookings', el: 'Κρατήσεις' },
  'admin.addClass': { en: 'Add Class', el: 'Προσθήκη Μαθήματος' },
  'admin.editClass': { en: 'Edit Class', el: 'Επεξεργασία Μαθήματος' },
  'admin.deleteClass': { en: 'Delete', el: 'Διαγραφή' },
  'admin.edit': { en: 'Edit', el: 'Επεξεργασία' },
  'admin.noClasses': { en: 'No classes yet. Add your first one!', el: 'Δεν υπάρχουν μαθήματα ακόμα. Πρόσθεσε το πρώτο!' },
  'admin.noBookings': { en: 'No bookings yet.', el: 'Δεν υπάρχουν κρατήσεις ακόμα.' },
  'admin.backToSite': { en: 'Back to site', el: 'Επιστροφή στο site' },
  'admin.confirmDelete': { en: 'Are you sure you want to delete this class?', el: 'Σίγουρα θέλεις να διαγράψεις αυτό το μάθημα;' },
  'admin.saved': { en: 'Class saved!', el: 'Το μάθημα αποθηκεύτηκε!' },
  'admin.deleted': { en: 'Class deleted.', el: 'Το μάθημα διαγράφτηκε.' },
  'admin.errorSave': { en: 'Failed to save. Please try again.', el: 'Αποτυχία αποθήκευσης. Δοκιμάστε ξανά.' },

  // Admin form fields
  'form.title': { en: 'Class title', el: 'Τίτλος μαθήματος' },
  'form.description': { en: 'Description', el: 'Περιγραφή' },
  'form.category': { en: 'Category', el: 'Κατηγορία' },
  'form.instructor': { en: 'Instructor', el: 'Δάσκαλος' },
  'form.ageMin': { en: 'Minimum age', el: 'Ελάχιστη ηλικία' },
  'form.ageMax': { en: 'Maximum age (blank = no limit)', el: 'Μέγιστη ηλικία (κενό = χωρίς όριο)' },
  'form.price': { en: 'Price per session (€)', el: 'Τιμή ανά μάθημα (€)' },
  'form.duration': { en: 'Duration (minutes)', el: 'Διάρκεια (λεπτά)' },
  'form.capacity': { en: 'Capacity', el: 'Χωρητικότητα' },
  'form.schedule': { en: 'Weekly schedule', el: 'Εβδομαδιαίο πρόγραμμα' },
  'form.imageUrl': { en: 'Image URL (optional)', el: 'URL εικόνας (προαιρετικά)' },
  'form.save': { en: 'Save', el: 'Αποθήκευση' },
  'form.cancel': { en: 'Cancel', el: 'Ακύρωση' },

  // Admin bookings table
  'booking.status.pending': { en: 'Pending', el: 'Εκκρεμής' },
  'booking.status.confirmed': { en: 'Confirmed', el: 'Επιβεβαιωμένη' },
  'booking.status.cancelled': { en: 'Cancelled', el: 'Ακυρωμένη' },
  'admin.participant': { en: 'Participant', el: 'Συμμετέχων' },
  'admin.age': { en: 'Age', el: 'Ηλικία' },
  'admin.booker': { en: 'Booker', el: 'Κρατών' },
  'admin.date': { en: 'Date', el: 'Ημερομηνία' },
  'admin.status': { en: 'Status', el: 'Κατάσταση' },

  // Admin stores tab
  'admin.studios': { en: 'Studios', el: 'Στούντιο' },
  'admin.addStudio': { en: 'Add Studio', el: 'Προσθήκη Στούντιο' },
  'admin.editStudio': { en: 'Edit Studio', el: 'Επεξεργασία Στούντιο' },
  'admin.noStudios': { en: 'No studios yet. Add your first one!', el: 'Δεν υπάρχουν στούντιο ακόμα. Πρόσθεσε το πρώτο!' },
  'admin.confirmDeleteStudio': { en: 'Are you sure you want to delete this studio? All its classes will also be deleted.', el: 'Σίγουρα θέλεις να διαγράψεις αυτό το στούντιο; Όλα τα μαθήματά του θα διαγραφούν επίσης.' },
  'admin.studioDeleted': { en: 'Studio deleted.', el: 'Το στούντιο διαγράφτηκε.' },
  'admin.studioSaved': { en: 'Studio saved!', el: 'Το στούντιο αποθηκεύτηκε!' },

  // Studio form fields
  'form.studioName': { en: 'Studio name', el: 'Όνομα στούντιο' },
  'form.studioDescription': { en: 'Studio description', el: 'Περιγραφή στούντιο' },
  'form.studioCategory': { en: 'Studio category', el: 'Κατηγορία στούντιο' },
  'form.area': { en: 'Area', el: 'Περιοχή' },
  'form.address': { en: 'Address', el: 'Διεύθυνση' },
  'form.phone': { en: 'Phone', el: 'Τηλέφωνο' },
  'form.email': { en: 'Email', el: 'Email' },
  'form.coverImage': { en: 'Cover image URL', el: 'URL εικόνας εξωφύλλου' },
  'form.photo1': { en: 'Studio photo 1 URL', el: 'URL φωτογραφίας στούντιο 1' },
  'form.photo2': { en: 'Studio photo 2 URL', el: 'URL φωτογραφίας στούντιο 2' },
  'form.floor': { en: 'Floor level', el: 'Όροφος' },
  'form.floorPh': { en: 'e.g. Ground floor, 2nd floor', el: 'π.χ. Ισόγειο, 2ος όροφος' },
  'form.disabilityAccess': { en: 'Wheelchair / disability access', el: 'Πρόσβαση για ΑΜΕΑ' },
  'form.rateInfo': { en: 'Rates & cost info', el: 'Τιμές & κόστος' },
  'form.rateInfoPh': { en: 'e.g. €20/session, €80/month', el: 'π.χ. 20€/μάθημα, 80€/μήνα' },
  'form.firstClassDiscount': { en: 'First class discount (%)', el: 'Έκπτωση 1ου μαθήματος (%)' },
  'form.studioSchedule': { en: 'Weekly schedule of classes', el: 'Εβδομαδιαίο πρόγραμμα μαθημάτων' },
  'form.studioSchedulePh': { en: 'e.g. Mon 18:00, Wed 18:00, Sat 10:00', el: 'π.χ. Δευ 18:00, Τετ 18:00, Σαβ 10:00' },

  // Studio listing request
  'listing.cta': { en: 'List your studio', el: 'Δήλωσε το στούντιό σου' },
  'listing.title': { en: 'List your studio', el: 'Δήλωσε το στούντιό σου' },
  'listing.desc': { en: 'Tell us about your studio and we will get in touch to set up your listing.', el: 'Πες μας για το στούντιό σου και θα επικοινωνήσουμε μαζί σου για να ετοιμάσουμε την καταχώρισή σου.' },
  'listing.studioName': { en: 'Studio name', el: 'Όνομα στούντιο' },
  'listing.studioNamePh': { en: 'e.g. Athens Dance Studio', el: 'π.χ. Athens Dance Studio' },
  'listing.email': { en: 'Email', el: 'Email' },
  'listing.phone': { en: 'Telephone', el: 'Τηλέφωνο' },
  'listing.phonePh': { en: '+30 210 000 0000', el: '+30 210 000 0000' },
  'listing.area': { en: 'Area', el: 'Περιοχή' },
  'listing.areaPh': { en: 'Choose an area', el: 'Επίλεξε περιοχή' },
  'listing.info': { en: 'Studio info', el: 'Πληροφορίες στούντιο' },
  'listing.infoPh': { en: 'What you teach, your experience, and anything parents should know', el: 'Τι διδάσκετε, η εμπειρία σας και ό,τι πρέπει να γνωρίζουν οι γονείς' },
  'listing.submit': { en: 'Send listing request', el: 'Αποστολή αιτήματος' },
  'listing.submitting': { en: 'Sending...', el: 'Αποστολή...' },
  'listing.successTitle': { en: 'Thank you!', el: 'Ευχαριστούμε!' },
  'listing.successDesc': { en: 'We have your details and will contact you soon to set up your studio.', el: 'Λάβαμε τα στοιχεία σας και θα επικοινωνήσουμε σύντομα για να ρυθμίσουμε το στούντιό σας.' },
  'listing.duplicate': { en: 'This email has already sent a listing request.', el: 'Αυτό το email έχει ήδη στείλει αίτημα καταχώρισης.' },
  'listing.error': { en: 'Something went wrong. Please try again.', el: 'Κάτι πήγε στραβά. Δοκιμάστε ξανά.' },
  'listing.privacy': { en: 'We only use these details to contact you about your listing.', el: 'Χρησιμοποιούμε αυτά τα στοιχεία μόνο για να επικοινωνήσουμε μαζί σας για την καταχώρισή σας.' },
  'listing.close': { en: 'Close', el: 'Κλείσιμο' },
  'admin.teachers': { en: 'Teachers', el: 'Εκπαιδευτές' },
  'adminTeachers.note': { en: 'Studio owners write these profiles. Here you can only approve, publish, or unpublish them.', el: 'Οι ιδιοκτήτες στούντιο συντάσσουν αυτά τα προφίλ. Εδώ μπορείτε μόνο να εγκρίνετε, να δημοσιεύσετε ή να αποσύρετε τα προφίλ.' },
  'adminTeachers.filter.pending': { en: 'Awaiting approval', el: 'Προς έγκριση' },
  'adminTeachers.filter.published': { en: 'Published', el: 'Δημοσιευμένα' },
  'adminTeachers.filter.draft': { en: 'Drafts', el: 'Πρόχειρα' },
  'adminTeachers.empty': { en: 'No profiles in this list.', el: 'Δεν υπάρχουν προφίλ σε αυτή τη λίστα.' },
  'adminTeachers.approve': { en: 'Approve & publish', el: 'Έγκριση & δημοσίευση' },
  'adminTeachers.returnDraft': { en: 'Send back', el: 'Επιστροφή' },
  'adminTeachers.unpublish': { en: 'Unpublish', el: 'Απόσυρση' },
  'adminTeachers.loadError': { en: 'Could not load teacher profiles.', el: 'Δεν ήταν δυνατή η φόρτωση των προφίλ.' },
  'adminTeachers.updateError': { en: 'Could not update this profile. Please try again.', el: 'Δεν ήταν δυνατή η ενημέρωση του προφίλ. Δοκιμάστε ξανά.' },
  'teachers.status.draft': { en: 'Draft', el: 'Πρόχειρο' },
  'teachers.status.pending': { en: 'Awaiting approval', el: 'Προς έγκριση' },
  'teachers.status.published': { en: 'Published', el: 'Δημοσιευμένο' },
  'teachers.experienceYears': { en: '{n} yrs experience', el: '{n} χρόνια εμπειρίας' },
  'teachers.ageRange': { en: 'Ages {min}–{max}', el: 'Ηλικίες {min}–{max}' },
  'teachers.agePlus': { en: 'Ages {min}+', el: 'Ηλικίες {min}+' },
  'teachers.ageGroupRequired': { en: 'Select at least one age group.', el: 'Επιλέξτε τουλάχιστον μία ηλικιακή ομάδα.' },
  'teachers.saveError': { en: 'Could not save the teacher profile. Please try again.', el: 'Δεν ήταν δυνατή η αποθήκευση του προφίλ. Δοκιμάστε ξανά.' },
  'teachers.editTitle': { en: 'Edit teacher', el: 'Επεξεργασία εκπαιδευτή' },
  'teachers.addTitle': { en: 'Add teacher', el: 'Προσθήκη εκπαιδευτή' },
  'teachers.add': { en: 'Add teacher', el: 'Προσθήκη εκπαιδευτή' },
  'teachers.name': { en: 'Full name', el: 'Ονοματεπώνυμο' },
  'teachers.photo': { en: 'Photo URL', el: 'URL φωτογραφίας' },
  'teachers.qualifications': { en: 'Qualifications', el: 'Προσόντα' },
  'qual.sports_science': { en: 'Sports science degree', el: 'Πτυχίο Επιστήμης Άθλησης' },
  'qual.education': { en: 'Teaching degree', el: 'Παιδαγωγικό πτυχίο' },
  'qual.arts': { en: 'Conservatory or arts degree', el: 'Πτυχίο Ωδείου ή Καλών Τεχνών' },
  'qual.university': { en: 'University degree', el: 'Πανεπιστημιακό πτυχίο' },
  'qual.certified_coach': { en: 'Certified coach', el: 'Πιστοποιημένος προπονητής' },
  'qual.federation_license': { en: 'Federation licensed', el: 'Αδειούχος ομοσπονδίας' },
  'qual.first_aid': { en: 'First aid certified', el: 'Πιστοποίηση πρώτων βοηθειών' },
  'teachers.ageGroups': { en: 'Age groups taught', el: 'Ηλικιακές ομάδες' },  'teachers.experienceYearsLabel': { en: 'Years of experience', el: 'Χρόνια εμπειρίας' },
  'teachers.experience': { en: 'Experience', el: 'Εμπειρία' },
  'teachers.experiencePh': { en: 'Competitions, clubs, teaching background...', el: 'Αγώνες, σύλλογοι, διδακτική εμπειρία...' },
  'teachers.republishNote': { en: 'This profile is published. Saving changes sends it back for admin approval.', el: 'Αυτό το προφίλ είναι δημοσιευμένο. Η αποθήκευση αλλαγών το στέλνει ξανά για έγκριση.' },
  'teachers.submitReview': { en: 'Submit for approval', el: 'Υποβολή για έγκριση' },
  'teachers.saveDraft': { en: 'Save as draft', el: 'Αποθήκευση ως πρόχειρο' },
  'teachers.confirmDelete': { en: 'Delete this teacher profile?', el: 'Διαγραφή αυτού του προφίλ;' },
  'teachers.deleted': { en: 'Teacher profile deleted.', el: 'Το προφίλ διαγράφηκε.' },
  'teachers.saved': { en: 'Teacher profile saved.', el: 'Το προφίλ αποθηκεύτηκε.' },
  'teachers.empty': { en: 'No teachers yet. Add your first teacher so families can meet them.', el: 'Δεν υπάρχουν εκπαιδευτές ακόμη. Προσθέστε τον πρώτο για να τον γνωρίσουν οι οικογένειες.' },
  'teachers.meetTeachers': { en: 'Meet the teachers', el: 'Γνωρίστε τους εκπαιδευτές' },
  'owner.title': { en: 'Your studio', el: 'Το στούντιό σας' },
  'owner.subtitle': { en: 'Update your studio details and manage your teachers.', el: 'Ενημερώστε τα στοιχεία του στούντιο και διαχειριστείτε τους εκπαιδευτές σας.' },
  'owner.studioSection': { en: 'Studio profile', el: 'Προφίλ στούντιο' },
  'owner.teachersSection': { en: 'Teachers', el: 'Εκπαιδευτές' },
  'owner.editStudio': { en: 'Edit studio', el: 'Επεξεργασία στούντιο' },
  'owner.noStudio': { en: 'Your studio could not be found. Please contact the Book@Class team.', el: 'Δεν βρέθηκε το στούντιό σας. Επικοινωνήστε με την ομάδα του Book@Class.' },
  'owner.loadError': { en: 'Could not load your studio. Please refresh the page.', el: 'Δεν ήταν δυνατή η φόρτωση του στούντιό σας. Ανανεώστε τη σελίδα.' },
  'owner.noAccessTitle': { en: 'No studio access', el: 'Δεν έχετε πρόσβαση σε στούντιο' },
  'owner.noAccessText': { en: 'This account is not linked to a studio. If you are a studio owner, ask us to send you an invitation.', el: 'Αυτός ο λογαριασμός δεν είναι συνδεδεμένος με στούντιο. Αν είστε ιδιοκτήτης στούντιο, ζητήστε μας πρόσκληση.' },
  'form.ownerEmail': { en: 'Studio owner email', el: 'Email ιδιοκτήτη στούντιο' },
  'form.ownerEmailHelp': { en: 'The owner can create an account with this email and will then manage this studio. Leave empty to skip.', el: 'Ο ιδιοκτήτης μπορεί να δημιουργήσει λογαριασμό με αυτό το email και θα διαχειρίζεται το στούντιο. Αφήστε κενό για παράλειψη.' },
  'auth.signUpHelp': { en: 'Sign-up is by invitation. Use the email address the Book@Class team invited.', el: 'Η εγγραφή γίνεται με πρόσκληση. Χρησιμοποιήστε το email που σας κάλεσε η ομάδα του Book@Class.' },
  'auth.errorSignUp': { en: 'Could not create the account. Check that this email was invited and that the password has at least 6 characters.', el: 'Δεν ήταν δυνατή η δημιουργία λογαριασμού. Ελέγξτε ότι το email έχει προσκληθεί και ότι ο κωδικός έχει τουλάχιστον 6 χαρακτήρες.' },
  'auth.needAccount': { en: 'Invited as a studio owner? Create your account', el: 'Προσκληθήκατε ως ιδιοκτήτης στούντιο; Δημιουργήστε λογαριασμό' },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string, params?: Record<string, string | number>) => string; tCat: (cat: string) => string; tArea: (area: string) => string };

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('byc-lang') : null;
    return saved === 'el' || saved === 'en' ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('byc-lang', lang);
  }, [lang]);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    let str = dict[key]?.[lang] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(new RegExp(`{${k}}`, 'g'), String(v));
      }
    }
    return str;
  }, [lang]);
  const tCat = (cat: string) => dict[`cat.${cat}`]?.[lang] ?? cat;
  const tArea = (area: string) => dict[`area.${area}`]?.[lang] ?? area;

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tCat, tArea }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
