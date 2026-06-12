# 🚀 Welcome to JOMI Code Challenge

## Instructions

1. Fork this repo and the frontend repo
2. Run the this cms server
3. Implement the items on Tasks section
4. Submit a pull-request to both frontend and backend

## Deadline
6 hours

## Running the backend cms server

1. clone repo
2. `yarn install`
3. Copy environment variables to .env file = `cp env.example .env`
4. Start the server `yarn develop`
5. Go to `http://localhost:1337`, create an admin user and Proceed to tasks

## Running the Nextjs server

1. `git clone https://github.com/jomijournal/jomi-challenge-frontend.git`
2. `yarn install`
3. Copy environment variables to .env file = `cp env.example .env`
4. Start the nextjs server using `yarn dev`
5. Go to http://localhost:3000

## Tasks

### Backend

1. Creating content for front-end. the CMS server has pre-defined types and components: `HomePage`, etc. Your first task is to build the content for the homepage so that the frontend can consume it and will be able to render the content. It should consist of the following:

- 2 Two-Column Blocks
- 1 HeaderBlock
- CarouselBlock 

### Front-end

1. In the front-end server, Fill-in the needed fields in the query on `homepage.graphql`. Run `yarn gen` to update the generated file (`homepage.generated.tsx`).
2. Complete components for `TwoColumnBlock` , `HeaderBlock`, `CarouselBlock` so that the front-end can properly render them. . You may use `HomePageSectionsComponent` to select the components based on their typename.
3. Note: Just search for all the //TODO comments and complete them.
4. After completing the the components create a pull-request of your fork, to the this repo (https://github.com/jomijournal/jomi-cms-challenge-backend) and send us a message upon completion.


## Mockup of the final output
### Header Block
![image](https://user-images.githubusercontent.com/10172560/164224358-9de2789a-0c3e-4a5d-aa56-68129194e104.png)

### Two Column Block
![image](https://user-images.githubusercontent.com/10172560/164224267-b39ebb80-e0c6-42cd-8e39-6d296ca52e07.png)
![image](https://user-images.githubusercontent.com/10172560/164224300-ff257823-b477-4a78-ace3-acf8fcee6276.png)

### Carousel Block
![image](https://user-images.githubusercontent.com/10172560/164224408-ef0703ef-d774-4ed2-8b56-4225614c455f.png)
