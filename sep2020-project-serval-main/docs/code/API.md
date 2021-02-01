REST API Documentatie
=====================


## Books
-----------------------------------------------------------------

```http
POST: /api/v1/books
```
### Beschrijving
> Verwacht een epub bestand en zet deze in de database.

### Verwacht
```js
body: {
	title: String,
	file: bestand.epub,
	cover: image.jpg
}
```

### Responses

```js
200: {
	success: true,
	book
}

412: {
	success: false,
	message: "No body present!
}

500: {
	success: false,
	message: errorObject
}
```
-----------------------------------------------------------------
```http
DELETE: /api/v1/books/{fileId}
```

### Beschrijving
> Verwacht het id van een boek die verwijdert moet worden.

### Verwacht
```js
params: {
	fileId: String
}
```

### Responses

```js
200: {
	success: true,
	message: 'Success!'
}

404: {
	success: false,
	message: 'Book not found'
}

500: {
	success: false
}
```

-----------------------------------------------------------------

```http
GET /api/v1/books/file/{fileId}
```

### Beschrijving
> Verwacht fileId en returnt dan info over het boek

### Verwacht
```js
params: {
	fileId: String
}
```

### Responses

```js
200: {
	success: true,
    file: {
        _id: String,
        length: Number,
        chunkSize: Number,
        uploadDate: String,
        filename: String,
        md5: String,
        contentType: String
    }
}

404: {
	success: false,
	message: String
}
```

-----------------------------------------------------------------
```http
GET: /api/v1/books/{fileId}/data
```

### Beschrijving
> Verkijgt data van het gegeven boek

### Verwacht
```js
params: {
	fileId: String
}
```

### Responses

```js
200: {
    success: true,
    message: {
        cover: {
            filename: String,
            fileId: String
        },
        createdAt: String,
        _id: String,
        metadata: {
            title: String,
            creator: String,
            description: String,
            pubdate: Number,
            publisher: String,
            identifier: String,
            language: String,
            rights: String,
            modified_date: String,
            layout: String,
            orientation: String,
            flow: String,
            viewport: String,
            media_active_class: String,
            spread: String,
            direction: String
        },
        filename: String,
        fileId: String,
        __v: Number
	}
	
404: {
	success: 404
}
```
-----------------------------------------------------------------

```http
GET: /api/v1/books/:fileId
```

### Beschrijving
> Haalt het epub bestand uit de database en stuurt deze terug

### Verwacht
```js
params: {
	fileId: String // id van het boek
}
```

### Responses

```js
200: .epub // Returnt een epub bestand.

404: { // bestand is niet gevonden.
	success: false,
	message: 'No files available',
}
```
-----------------------------------------------------------------

```http
GET: /api/v1/books/:fileId/cover
```

### Beschrijving
> Haalt de cover van het aangegevenboek uit de database

### Verwacht
```js
params: {
	fileId: String // id van het boek
}
```

### Responses

```js
200: image (geen vast datatype)

404: { // bestand is niet gevonden.
	success: false,
	message: 'No files available',
}
```
-----------------------------------------------------------------

## Users
-----------------------------------------------------------------

```http
POST /api/v1/users
```

### Beschrijving
> Insert een nieuwe user in de database.

### Verwacht
```js
body: {
	username: String
}  
```

### Responses

```js
200: {
	succes: true
}

500: {
	succes: false,
	message: String
}
```
-----------------------------------------------------------------

```http
GET /api/v1/{USER}
```

### Beschrijving
> Verkrijgt een specifieke user.

### Verwacht
```js
params: {
	USER: String
}
```

### Responses
```js
200: {
	username: String
}

404: {
	succes: false,
	message: "User not found"
}
```
-----------------------------------------------------------------

```http
PUT /api/v1/users/{USER}/pin
```

### Beschrijving
> Veranderd de pin van de specifieke user

### Verwacht
```js
params: {
	USER: String
}
```

### Responses
```js
200: {
	success: true,
	message: "Update successful"
}

500: {
	success: false,
	message: String
}
```

-----------------------------------------------------------------

```http
GET /api/v1/{USER}/books
```

### Beschrijving
> Verkrijgt een lijst van de boeken van de user

### Verwacht
```js
params: {
	USER: String
}
```

### Responses
```js
200: [
		{
			currentLocation: {
				currentPage: Number,
				chapterNumber: Number,
				totalPages: Number,
				epubcfi: String
			},
			lastOpened: String,
			_id: String,
			createdAt: String,
			metadata: {
				title: String,
				creator: String,
				description: String,
				pubdate: String,
				publisher: String,
				identifier: String,
				language: String,
				rights: String,
				modified_date: String,
				layout: String,
				orientation: String,
				flow: String,
				viewport: String,
				media_active_class: String,
				spread: String,
				direction: String
			},
			filename: String,
			fileId: String,
			cover: {
				filename: String,
				fileId: String
			},
			__v: Number
		}
	]

404: {
	success: false,
	message: "User not found"
}
```
-----------------------------------------------------------------

```http
PATCH /api/v1/{USER}/books/{BookID}/currentLocation
```

### Beschrijving
> Update de currentLocation van het geopende boek van de inglogde user

### Verwacht
```js
params: {
	USER: String
	BookID: String
}
body: {
	currentLocation : {
		currentPage: [Number]
		totalPages: [Number]
		chapterNumber: [Number]
	}
}
```

### Responses
```js
200: [String]
```
-----------------------------------------------------------------

```http
GET /api/v1/{USER}/books/{BookID}/currentLocation
```

### Beschrijving
> Haalt de currentLocation op uit de ingelogde user van het geopende boek

### Verwacht
```js
params: {
	USER: String
	BookID: String
}
```

### Responses
```js
200: [String]
body: {
	id: [String]
	currentLocation: {
		currentPage: [Number]
		totalPages: [Number]
		chapterNumber: [Number]
	}
}
```
-----------------------------------------------------------------

```http
PATCH /api/v1/{USER}/books/{BookID}/lastOpened
```

### Beschrijving
> Update de last Opened van het boek

### Verwacht
```js
params: {
	USER: String
	BookID: String
}
```

### Responses
```js
200: {
	success: true
}

500: {
	success: false,
	message: String
}
```

-----------------------------------------------------------------

```http
GET /api/v1/users/{USER}/preferences
```

### Beschrijving
> Verkrijgt de preferences van de specifieke user

### Verwacht
```js
params: {
	USER: String
}
```

### Responses
```js
200: {
    textToSpeech: {
        tts: Boolean,
        ttsVolume: Number,
        ttsRate: Number
    },
    preferences: {
        backgroundColor: String,
        fontColor: String,
        fontFamily: String,
        fontSize: Number,
        letterSpacing: Number,
        lineHeight: Number
    },
    readingMethod: String
}

404: {
	success: false,
	message: "User not found"
}
```

-----------------------------------------------------------------

```http
GET /api/v1/users/{USER}/preferences
```

### Beschrijving
> Update de preferences van de user

### Verwacht
```js
params: {
	USER: String
}
```

### Responses
```js
200: {
	success: true,
	preferences: {
		textToSpeech: {
			tts: Boolean,
			ttsVolume: Number,
			ttsRate: Number
		},
		preferences: {
			backgroundColor: String,
			fontColor: String,
			fontFamily: String,
			fontSize: Number,
			letterSpacing: Number,
			lineHeight: Number
		},
		readingMethod: String
	}
}

404: {
	success: false,
	message: "User not found"
}
```

-----------------------------------------------------------------

```http
PUT /api/v1/users/{USER}/readingMethod
```

### Beschrijving
> Verwacht een user en veranderd dan de readingmethod

### Verwacht
```js
params: {
	USER: String
}

body: {
	method: String
}
```

### Responses
```js
200: {
	success: true,
	readingMethod: String
}

404: {
	success: false,
	message: "User not found"
}
```

-----------------------------------------------------------------

```http
PUT /api/v1/users/{USER}/tts
```

### Beschrijving
> update de tts voor een specifieke user

### Verwacht
```js
params: {
	USER: String
}

body: String
```

### Responses
```js
200: {
	success: true,
	textToSpeech: String
}

404: {
	success: false,
	message: "User not found"
}
```

-----------------------------------------------------------------