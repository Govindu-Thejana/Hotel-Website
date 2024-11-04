import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';

const RoomSelect = () => {
    const [rooms, setRooms] = useState([
        { id: 1, type: 'Deluxe Suite', price: 812, perNight: 116, count: 0 },
        { id: 2, type: 'Executive Suite', price: 1512, perNight: 216, count: 0 },
        { id: 3, type: 'Premium Suite', price: 1743, perNight: 249, count: 0 },
    ]);

    const updateRoomCount = (id, increment) => {
        setRooms(rooms.map(room =>
            room.id === id ? { ...room, count: Math.max(0, room.count + increment) } : room
        ));
    };

    return (
        <div className="max-w-4xl bg-acolor px-5 py-5 mx-auto p-1 font-sans">
            {/* Step indicator */}


            <h1 className="text-2xl font- font-serif mb-8">ROOM SELECT</h1>

            {/* Room listings */}
            {rooms.map((room) => (
                <div key={room.id} className="mb-8 pb-8 border-b bg-gray-100 px-2 py-2 border-gray-200">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">

                            <h2 className="text-xl font-semibold mb-2">{room.type}</h2>
                            <div className='flex'>
                                <img
                                    src="/images/room1.jpeg" alt={`Room view `}
                                    className=" "
                                />
                                <div>
                                    <ul className="text-sm px-2 text-pcolor mb-2">
                                        <li>Breakfast {room.type === 'Single room' ? 'CHF 20 (Optional)' : 'included'}</li>
                                        <li>Pay in advance</li>
                                        <li>Free cancellation 48 hours prior</li>
                                        <li>{room.type === 'Family room' ? 'Garden view & City View' : (room.type === 'Double room' ? 'Garden view' : 'City view')}</li>
                                    </ul>
                                    <p className="text-sm px-2">
                                        Sleeps 2 people | Private bathroom | Air conditioning |
                                        Flat-screen TV | Minibar | Free toiletries
                                        {room.type === 'Family room' && ' | Coffee Machine'}
                                    </p>
                                </div>
                            </div>



                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center mb-2">
                                <button onClick={() => updateRoomCount(room.id, -1)} className="p-1">
                                    <Minus size={16} />
                                </button>
                                <span className="mx-2 w-8 text-center">{room.count}</span>
                                <button onClick={() => updateRoomCount(room.id, 1)} className="p-1">
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-600"> {room.perNight} $ per/night</p>
                            </div>
                            <button className="mt px-4 py-2 rounded-sm hover:bg-navy hover:bg-pcolor text-white bg-scolor transition-colors">
                                RESERVE
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default RoomSelect;;