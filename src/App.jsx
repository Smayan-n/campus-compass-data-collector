import { GeoPoint, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import "./App.css";
import { firebaseStorage, firestoreDB } from "./firebase";
//new comment

const buildings = [
	"Anderson Hall (AND)",
	"Architecture Hall (ARC)",
	"Art Building (ART)",
	"Bagley Hall (BAG)",
	"Bank of America Executive Education Center (EXED)",
	"Benson Hall (BNS)",
	"Paul G. Allen Center for Computer Science & Engineering (CSE1)",
	"Bill and Melinda Gates Center for Computer Science and Engineering (CSE2)",
	"Bloedel Hall (BLD)",
	"Chemistry Library Building (CHL)",
	"Clark Hall (CLK)",
	"Communications Building (CMU)",
	"Condon Hall (CDH)",
	"Dempsey Hall (DEM)",
	"Denny Hall (DEN)",
	"Eagleson Hall (EGL)",
	"Electrical and Computer Engineering Building (ECE)",
	"Fisheries Teaching and Research Center (FTR)",
	"Fishery Sciences Building (FSH)",
	"Gould Hall (GLD)",
	"Gowen Hall (GWN)",
	"Guggenheim Hall (GUG)",
	"Hans Rosling Center for Population Health (HRC)",
	"Hitchcock Hall (HCK)",
	"Johnson Hall (JHN)",
	"Kane Hall (KNE)",
	"Loew Hall (LOW)",
	"Marine Studies Building (MAR)",
	"Mary Gates Hall (MGH)",
	"Mechanical Engineering Building (MEB)",
	"Miller Hall (MLR)",
	"More Hall (MOR)",
	"Mueller Hall (MUE)",
	"Music Building (MUS)",
	"Nanoengineering and Sciences Bldg (NAN)",
	"Oceanography Teaching Building (OTB)",
	"Odegaard Undergraduate Library (OUG)",
	"Paccar Hall (PCAR)",
	"Parrington Hall (PAR)",
	"Physics/Astronomy Auditorium (PAA)",
	"Physics/Astronomy Building (PAB)",
	"Raitt Hall (RAI)",
	"Savery Hall (SAV)",
	"Sieg Hall (SIG)",
	"Smith Hall (SMI)",
	"Social Work/Speech and Hearing Sciences Building (SWS)",
	"Thomson Hall (THO)",
	"Winkenwerder Forest Science Lab (WFS)",
	"Intramural Activities Center (IMA)",
	"The Husky Union Building",
	"Suzzallo & Allen Library",
];

function App() {
	const [selectedImage, setSelectedImage] = useState(null);
	const vendingRef = useRef(null);
	const vendingDrinkRef = useRef(null);
	const vendingSnackRef = useRef(null);
	const vendingUtilitiesRef = useRef(null);
	const fountainRef = useRef(null);
	const fountainDrinkingRef = useRef(null);
	const fountainBottleRef = useRef(null);
	const latRef = useRef(null);
	const longRef = useRef(null);

	const floorRef = useRef(null);
	const descRef = useRef(null);
	const buildingRef = useRef(null);

	const [coords, setCoords] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		const vending = vendingRef.current.checked;
		const vendingDrink = vendingDrinkRef.current.checked;
		const vendingSnack = vendingSnackRef.current.checked;
		const vendingUtilities = vendingUtilitiesRef.current.checked;
		const fountain = fountainRef.current.checked;
		const fountainDrinking = fountainDrinkingRef.current.checked;
		const fountainBottle = fountainBottleRef.current.checked;
		const floor = floorRef.current.value;
		const desc = descRef.current.value;
		const building = buildingRef.current.value;
		const lat = latRef.current.value;
		const long = longRef.current.value;

		console.log(building, buildings.includes(building));
		if (vending || fountain) {
			if (
				floor &&
				desc &&
				(coords || (lat && long)) &&
				selectedImage &&
				building &&
				buildings.includes(building)
			) {
				let subtypes = [];
				if (vending) {
					if (vendingDrink) {
						subtypes.push("drink");
					}
					if (vendingSnack) {
						subtypes.push("snack");
					}
					if (vendingUtilities) {
						subtypes.push("utility");
					}
				}
				if (fountain) {
					if (fountainDrinking) {
						subtypes.push("drinking");
					}
					if (fountainBottle) {
						subtypes.push("bottle");
					}
				}
				if (subtypes.length > 0) {
					const resource = {
						floor: parseInt(floor),
						building: building,
						description: desc,
						type: vending ? "vending" : "fountain",
						subtypes: subtypes,
						coords: lat && long ? new GeoPoint(lat, long) : new GeoPoint(coords.latitude, coords.longitude),
					};
					addResourceToDatabase(resource);
				} else {
					err();
				}
			} else {
				err();
			}
		} else {
			err();
		}
	};

	const err = () => {
		window.alert("Please fill out all fields and upload image (*make sure building is valid*)");
	};

	async function uploadImageToStorage(docId) {
		const storageRef = await ref(firebaseStorage, `images/${docId}`);
		uploadBytes(storageRef, selectedImage).then(
			(snapshot) => {
				window.alert("Uploaded image file!", snapshot.id);
				console.log("Uploaded image file!", snapshot.id);

				//reload page
				window.location.reload();
			},
			(error) => {
				window.alert("Error uploading image file: ", error);
			}
		);
	}

	async function addResourceToDatabase(resource) {
		const ref = collection(firestoreDB, "Resources");
		addDoc(ref, resource).then(
			(docRef) => {
				window.alert("Added Resource document to Database", docRef.id);
				console.log("Added Resource document to Database", docRef.id);
				//now upload image
				uploadImageToStorage(docRef.id);
			},
			(error) => {
				window.alert("Error adding document: ", error);
			}
		);
	}

	const captureCoords = () => {
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setCoords(pos.coords);
			},
			(err) => {
				console.log(err);
			}
		);
	};

	return (
		<div className="outer">
			<form onSubmit={handleSubmit} className="main-form">
				{/* Resource and then each resource has a subtype (snack and drink vending machine htmlFor example)*/}
				<div className="type-section">
					<div className="type-subsection">
						<div className="type-sssc">
							<input ref={fountainRef} type="radio" id="fountain" name="fav_language" value="HTML" />
							<label htmlFor="fountain">Water Fountain</label>
						</div>
						<div className="type-sssc">
							<label htmlFor="dog">Drinking:</label>
							<input ref={fountainDrinkingRef} type="checkbox" id="dog" value="drink" />
							<label htmlFor="cat">Bottle:</label>
							<input ref={fountainBottleRef} type="checkbox" id="cat" value="snack" />
						</div>
					</div>

					<div className="type-subsection">
						<div className="type-sssc">
							<input ref={vendingRef} type="radio" id="vending" name="fav_language" value="CSS" />
							<label htmlFor="vending">Vending Machine</label>
						</div>
						<div className="type-sssc">
							<label htmlFor="do">Drink:</label>
							<input ref={vendingDrinkRef} type="checkbox" id="do" value="drinking" />
							<label htmlFor="ca">Snack:</label>
							<input ref={vendingSnackRef} type="checkbox" id="ca" value="bottle" />
							<label htmlFor="caw">Utilities:</label>
							<input ref={vendingUtilitiesRef} type="checkbox" id="caw" value="bottle" />
						</div>
					</div>
				</div>

				<label htmlFor="building">Building </label>
				<input ref={buildingRef} list="buildings" name="building" id="building"></input>
				<datalist id="buildings">
					{buildings.map((building, index) => (
						<option key={index} value={building}>
							{building}
						</option>
					))}
				</datalist>

				<label htmlFor="desc">Description</label>
				<input ref={descRef} type="text" id="desc" />

				<label htmlFor="floor">Floor</label>
				<input ref={floorRef} type="number" id="floor" />

				<p>Leave blank if using auto-coords</p>
				<div className="coords-div">
					<label htmlFor="lat">lat</label>
					<input ref={latRef} type="number" step="0.00000000000000001" id="lat" />
					<label htmlFor="long">long</label>
					<input ref={longRef} type="number" step="0.0000000000000001" id="long" />
				</div>

				<button onClick={captureCoords} className="coord" type="button">
					Record Coords
				</button>
				{coords && (
					<div className="coord-disp">
						{coords.latitude}, {coords.longitude}
					</div>
				)}
				<input
					type="file"
					name="myImage"
					onChange={(event) => {
						setSelectedImage(event.target.files[0]);
					}}
				/>
				{selectedImage && (
					<div className="image-viewer">
						<img width="100px" alt="No Image Selected" src={URL.createObjectURL(selectedImage)}></img>
					</div>
				)}

				<button type="submit">Submit</button>
			</form>
		</div>
	);
}

export default App;
