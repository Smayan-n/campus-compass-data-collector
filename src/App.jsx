import { GeoPoint, addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import "./App.css";
import { firebaseStorage, firestoreDB } from "./firebase";
//new comment

function App() {
	const [selectedImage, setSelectedImage] = useState(null);
	const vendingRef = useRef(null);
	const vendingDrinkRef = useRef(null);
	const vendingSnackRef = useRef(null);
	const vendingUtilitiesRef = useRef(null);
	const fountainRef = useRef(null);
	const fountainDrinkingRef = useRef(null);
	const fountainBottleRef = useRef(null);

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

		if (vending || fountain) {
			if (floor && desc && building && coords && selectedImage) {
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
						coords: new GeoPoint(coords.latitude, coords.longitude),
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
		window.alert("Please fill out all fields and upload image");
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

				<label htmlFor="building">Building</label>
				<input ref={buildingRef} type="text" id="building" />

				<label htmlFor="desc">Description</label>
				<input ref={descRef} type="text" id="desc" />

				<label htmlFor="floor">Floor</label>
				<input ref={floorRef} type="number" id="floor" />

				<button
					onClick={navigator.geolocation.getCurrentPosition(
						(pos) => {
							console.log(pos);
							setCoords(pos.coords);
						},
						(err) => {
							console.log(err);
						}
					)}
					className="coord"
					type="button"
				>
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
