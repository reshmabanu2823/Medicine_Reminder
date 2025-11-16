import React, { useEffect, useState } from 'react';

function readTheme(){
  try{ return localStorage.getItem('theme') || 'light'; }catch{ return 'light'; }
}

export default function ThemeToggleIcon(){
// Dark mode icon/toggle removed as per request.
