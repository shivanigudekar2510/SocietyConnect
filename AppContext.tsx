import React, { createContext, useState, useContext, useEffect } from 'react';

export type WalkInStatus = 'Pending' | 'Approved' | 'Denied';

export interface WalkIn {
  id: string;
  type: string;
  name: string;
  flat: string;
  vehicle?: string;
  status: WalkInStatus;
  time: string;
}

export interface Vehicle {
  plate: string;
  flat: string;
  owner: string;
}

export interface Resident {
  id: string;
  flat: string;
  name: string;
  type: 'Owner' | 'Tenant';
}

export interface AmenityBooking {
  id: string;
  flat: string;
  amenity: string;
  date: string;
  timeSlot: string;
}

export interface DailyHelp {
  id: string;
  name: string;
  category: 'Maid' | 'Cook' | 'Driver' | 'Milkman' | 'Nanny' | 'Other';
  flat: string;
  isPresent: boolean;
  lastCheckIn?: string;
  lastCheckOut?: string;
}

export type ParcelStatus = 'Pending' | 'Collected';
export interface Parcel {
  id: string;
  flat: string;
  recipientName: string;
  deliveryCompany: string;
  date: string;
  time: string;
  status: ParcelStatus;
  pickupCode: string;
}

export interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: { [option: string]: number };
  votedBy: string[];
}

export interface Classified {
  id: string;
  title: string;
  description: string;
  price: string;
  contact: string;
  flat: string;
  category: 'Sale' | 'Rent' | 'Services' | 'Carpool';
}

export interface SOSAlert {
  id: string;
  flat: string;
  time: string;
  status: 'Active' | 'Resolved';
}

interface AppContextType {
  walkIns: WalkIn[];
  addWalkIn: (walkIn: Omit<WalkIn, 'id' | 'time'>) => void;
  updateWalkInStatus: (id: string, status: WalkInStatus) => void;
  
  vehicles: Vehicle[];
  residents: Resident[];
  
  amenityBookings: AmenityBooking[];
  bookAmenity: (booking: Omit<AmenityBooking, 'id'>) => void;

  dailyHelps: DailyHelp[];
  addDailyHelp: (help: Omit<DailyHelp, 'id' | 'isPresent'>) => void;
  toggleDailyHelpStatus: (id: string) => void;
  deleteDailyHelp: (id: string) => void;

  parcels: Parcel[];
  addParcel: (parcel: Omit<Parcel, 'id' | 'status' | 'pickupCode'>) => void;
  collectParcel: (id: string, pickupCode: string) => boolean;

  polls: Poll[];
  createPoll: (poll: Omit<Poll, 'id' | 'votes' | 'votedBy'>) => void;
  votePoll: (pollId: string, option: string, voterFlat: string) => void;

  classifieds: Classified[];
  addClassified: (classified: Omit<Classified, 'id'>) => void;
  removeClassified: (id: string) => void;

  sosAlerts: SOSAlert[];
  triggerSOS: (flat: string) => void;
  resolveSOS: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [walkIns, setWalkIns] = useState<WalkIn[]>([]);
  const [vehicles] = useState<Vehicle[]>([
    { plate: 'MH12AB1234', flat: 'Flat 402', owner: 'Suresh Kumar' },
    { plate: 'MH14CD5678', flat: 'Flat 105', owner: 'Rahul Sharma' },
  ]);
  const [residents] = useState<Resident[]>([
    { id: 'r1', flat: 'Flat 402', name: 'Suresh Kumar', type: 'Owner' },
    { id: 'r2', flat: 'Flat 105', name: 'Rahul Sharma', type: 'Tenant' },
    { id: 'r3', flat: 'Flat 602', name: 'Anita Desai', type: 'Owner' },
  ]);

  const [amenityBookings, setAmenityBookings] = useState<AmenityBooking[]>([]);
  const [dailyHelps, setDailyHelps] = useState<DailyHelp[]>([]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [classifieds, setClassifieds] = useState<Classified[]>([]);
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);

  useEffect(() => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;

      // Listeners for real-time synchronization
      const unsubscribeWalkIns = firestore().collection('walk_ins').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: WalkIn[] = [];
        snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
        setWalkIns(docs);
      });

      const unsubscribeAmenities = firestore().collection('amenity_bookings').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: AmenityBooking[] = [];
        snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
        setAmenityBookings(docs);
      });

      const unsubscribeDailyHelp = firestore().collection('daily_helps').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: DailyHelp[] = [];
        snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
        setDailyHelps(docs);
      });

      const unsubscribeParcels = firestore().collection('parcels').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: Parcel[] = [];
        snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
        setParcels(docs);
      });

      const unsubscribePolls = firestore().collection('polls').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: Poll[] = [];
        snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
        setPolls(docs);
      });

      const unsubscribeClassifieds = firestore().collection('classifieds').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: Classified[] = [];
        snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
        setClassifieds(docs);
      });

      const unsubscribeSOS = firestore().collection('sos_alerts').onSnapshot((snap: any) => {
        if (!snap) return;
        const docs: SOSAlert[] = [];
        snap.forEach((doc: any) => docs.push({ id: doc.id, ...doc.data() }));
        setSosAlerts(docs);
      });

      return () => {
        unsubscribeWalkIns();
        unsubscribeAmenities();
        unsubscribeDailyHelp();
        unsubscribeParcels();
        unsubscribePolls();
        unsubscribeClassifieds();
        unsubscribeSOS();
      };
    } catch (e) {
      console.log('ℹ️ Firebase Firestore listeners could not initialize.', e);
    }
  }, []);

  const addWalkIn = async (walkIn: Omit<WalkIn, 'id' | 'time'>) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await firestore().collection('walk_ins').add({
        ...walkIn,
        time
      });
    } catch (err) {
      console.log('Error adding walkin to firestore', err);
    }
  };

  const updateWalkInStatus = async (id: string, status: WalkInStatus) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('walk_ins').doc(id).update({ status });
    } catch (err) {
      console.log('Error updating walkin in firestore', err);
    }
  };

  const bookAmenity = async (booking: Omit<AmenityBooking, 'id'>) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('amenity_bookings').add(booking);
    } catch (err) {
      console.log('Error booking amenity in firestore', err);
    }
  };

  const addDailyHelp = async (help: Omit<DailyHelp, 'id' | 'isPresent'>) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('daily_helps').add({
        ...help,
        isPresent: false
      });
    } catch (err) {
      console.log('Error adding daily help in firestore', err);
    }
  };

  const toggleDailyHelpStatus = async (id: string) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const helper = dailyHelps.find(h => h.id === id);
      if (helper) {
        await firestore().collection('daily_helps').doc(id).update({
          isPresent: !helper.isPresent,
          lastCheckIn: !helper.isPresent ? timeStr : helper.lastCheckIn,
          lastCheckOut: helper.isPresent ? timeStr : helper.lastCheckOut,
        });
      }
    } catch (err) {
      console.log('Error toggling daily help status', err);
    }
  };

  const deleteDailyHelp = async (id: string) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('daily_helps').doc(id).delete();
    } catch (err) {
      console.log('Error deleting daily help from firestore', err);
    }
  };

  const addParcel = async (parcel: Omit<Parcel, 'id' | 'status' | 'pickupCode'>) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = '';
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      await firestore().collection('parcels').add({
        ...parcel,
        status: 'Pending',
        pickupCode: code
      });
    } catch (err) {
      console.log('Error adding parcel to firestore', err);
    }
  };

  const collectParcel = (id: string, pickupCode: string) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const parcel = parcels.find(p => p.id === id);
      if (parcel && parcel.pickupCode.toUpperCase() === pickupCode.toUpperCase()) {
        firestore().collection('parcels').doc(id).update({ status: 'Collected' });
        return true;
      }
    } catch (err) {
      console.log('Error collecting parcel', err);
    }
    return false;
  };

  const createPoll = async (poll: Omit<Poll, 'id' | 'votes' | 'votedBy'>) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const initialVotes: { [option: string]: number } = {};
      poll.options.forEach(opt => { initialVotes[opt] = 0; });
      await firestore().collection('polls').add({
        ...poll,
        votes: initialVotes,
        votedBy: []
      });
    } catch (err) {
      console.log('Error creating poll', err);
    }
  };

  const votePoll = async (pollId: string, option: string, voterFlat: string) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const poll = polls.find(p => p.id === pollId);
      if (poll && !poll.votedBy.includes(voterFlat)) {
        const updatedVotes = { ...poll.votes, [option]: (poll.votes[option] || 0) + 1 };
        await firestore().collection('polls').doc(pollId).update({
          votes: updatedVotes,
          votedBy: [...poll.votedBy, voterFlat]
        });
      }
    } catch (err) {
      console.log('Error voting poll', err);
    }
  };

  const addClassified = async (classified: Omit<Classified, 'id'>) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('classifieds').add(classified);
    } catch (err) {
      console.log('Error adding classified in firestore', err);
    }
  };

  const removeClassified = async (id: string) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('classifieds').doc(id).delete();
    } catch (err) {
      console.log('Error removing classified in firestore', err);
    }
  };

  const triggerSOS = async (flat: string) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await firestore().collection('sos_alerts').add({
        flat,
        time,
        status: 'Active'
      });
    } catch (err) {
      console.log('Error triggering SOS alert', err);
    }
  };

  const resolveSOS = async (id: string) => {
    try {
      const firestore = require('@react-native-firebase/firestore').default;
      await firestore().collection('sos_alerts').doc(id).update({ status: 'Resolved' });
    } catch (err) {
      console.log('Error resolving SOS alert', err);
    }
  };

  return (
    <AppContext.Provider value={{
      walkIns, addWalkIn, updateWalkInStatus,
      vehicles, residents,
      amenityBookings, bookAmenity,
      dailyHelps, addDailyHelp, toggleDailyHelpStatus, deleteDailyHelp,
      parcels, addParcel, collectParcel,
      polls, createPoll, votePoll,
      classifieds, addClassified, removeClassified,
      sosAlerts, triggerSOS, resolveSOS
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
