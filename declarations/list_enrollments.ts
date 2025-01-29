import { CanvasAPI } from 'canvas-sdk';

export const listEnrollments = {
  method: 'GET',
  path: '/api/v1/users/:user_id/enrollments',
  parameters: {
    user_id: { type: 'string', required: true },
    include: { type: 'string[]', required: false },
    state: { type: 'string[]', required: false },
    role: { type: 'string[]', required: false },
  },
  response: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        course_id: { type: 'integer' },
        user_id: { type: 'integer' },
        enrollment_state: { type: 'string' },
        grades: {
          type: 'object',
          properties: {
            current_score: { type: 'number' },
            current_grade: { type: 'string' },
            current_points: { type: 'number' },
          },
        },
      },
    },
  },
};
