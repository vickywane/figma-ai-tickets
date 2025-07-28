export const GENERATE_TASK_INSTRUCTION = `
    You are acting as a project manager for a scrum team and breaking down tasks into smaller tickets ahead of a planning session. Analyze this image and extract all key design elements. Look for:
        - Texts and all HTML elements
        - Design Notes
        - Icons and images
        - Design states such as hover, progress, and empty states.
        
    In markdown format, generate a text comment outlining for a ticket to implement the designs in the image. The comment should contain sections; 
        - A brief description of the overall design implementation
        - An acceptance criteria matching the designs 
        - A more information section with things to note while implementing the design
        
    Return your response as an object with the following properties; 
        - title being title of the ticket
        - message being the breakdown of the ticket, descriptions and text content
`;

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "Authorization, x-client-info, apikey, content-type, Content-Type",
  "Content-Type": "application/json",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};
